import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";

@customElement("flash-card")
export class FlashCard extends LitElement {
  @property() question = "";
  @property({ attribute: false }) choices: string[] = [];
  @property({ type: Number }) correctIndex = 0;

  @state() selectedIndex: number | null = null;
  @state() answered = false;

  @state() leaving = false;

  @query(".card") cardEl?: HTMLElement;

  get isCorrect() {
    return this.selectedIndex === this.correctIndex;
  }

  handleClick(index: number) {
    if (this.answered) return;
    this.selectedIndex = index;
    this.answered = true;
  }

  handleNext() {
    this.leaving = true;
    this.cardEl?.addEventListener(
      "animationend",
      () => {
        this.dispatchEvent(
          new CustomEvent("answer-selected", {
            detail: { isCorrect: this.isCorrect },
          }),
        );
        this.selectedIndex = null;
        this.answered = false;
        this.leaving = false;
      },
      { once: true },
    );
  }

  render() {
    return html`
      <div class="card ${this.leaving ? "leaving" : ""}">
        <h3 class="question">${this.question}</h3>
        <div class="choices">
          ${map(this.choices, (choice, index) => {
            const isSelected = this.selectedIndex === index;
            const isCorrectChoice = index === this.correctIndex;
            const classes = {
              choice: true,
              selected: isSelected,
              correct: this.answered && isCorrectChoice,
              wrong: this.answered && isSelected && !isCorrectChoice,
              disabled: this.answered && !isSelected && !isCorrectChoice,
            };
            return html`
              <button
                class=${classMap(classes)}
                @click=${() => this.handleClick(index)}
                ?disabled=${this.answered}
              >
                ${choice}
              </button>
            `;
          })}
        </div>
        <button
          class="next-btn"
          @click=${this.handleNext}
          ?disabled=${!this.answered}
        >
          Next
        </button>
      </div>
    `;
  }

  static styles = css`
    .card {
      background: white;
      border: 1px solid #d2d2d7;
      border-radius: 16px;
      padding: 2rem;
      animation: slideIn 0.3s ease-out;
    }

    .card.leaving {
      animation: slideOut 0.25s ease-in forwards;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(-30px);
      }
    }

    .question {
      font-size: 1.3rem;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0 0 1.5rem;
    }

    .choices {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.625rem;
    }

    @media (max-width: 500px) {
      .choices {
        grid-template-columns: 1fr;
      }

      .card {
        padding: 1.5rem;
        border-radius: 16px;
      }
    }

    .choice {
      background: #f5f5f7;
      border: 1.5px solid transparent;
      border-radius: 12px;
      padding: 0.875rem 1rem;
      color: #1d1d1f;
      font-size: 0.95rem;
      font-weight: 400;
      cursor: pointer;
    }

    .choice:hover:not(:disabled) {
      background: #e8e8ed;
    }

    .choice:focus-visible {
      outline: 3px solid rgba(0, 113, 227, 0.4);
      outline-offset: 1px;
    }

    .choice.correct {
      background: rgba(52, 199, 89, 0.12);
      border-color: #34c759;
      color: #248a3d;
    }

    .choice.wrong {
      background: rgba(255, 59, 48, 0.1);
      border-color: #ff3b30;
      color: #d70015;
    }

    .choice.disabled {
      opacity: 0.4;
    }

    .choice:disabled {
      cursor: default;
    }

    .next-btn {
      display: block;
      margin: 1.5rem 0 0 auto;
      padding: 0.65rem 1.5rem;
      background: #0071e3;
      color: white;
      border: none;
      border-radius: 980px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
    }

    .next-btn:hover:not(:disabled) {
      background: #0077ed;
    }

    .next-btn:disabled {
      background: #d2d2d7;
      cursor: not-allowed;
    }

    .next-btn:focus-visible {
      outline: 3px solid rgba(0, 113, 227, 0.4);
      outline-offset: 2px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "flash-card": FlashCard;
  }
}
