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

  private boundKeyHandler = this.handleKeydown.bind(this);

  get isCorrect() {
    return this.selectedIndex === this.correctIndex;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.boundKeyHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.boundKeyHandler);
  }

  private handleKeydown(e: KeyboardEvent) {
    if (this.leaving) return;

    const num = parseInt(e.key);
    if (!this.answered && num >= 1 && num <= this.choices.length) {
      e.preventDefault();
      this.handleClick(num - 1);
      return;
    }

    if (this.answered && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      this.handleNext();
    }
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
                <span class="key-hint">${index + 1}</span>
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
      background: var(--color-surface);
      border: 1px solid var(--color-border);
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
      color: var(--color-text);
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
      display: flex;
      align-items: center;
      gap: 0.625rem;
      background: var(--color-surface-secondary);
      border: 1.5px solid transparent;
      border-radius: 12px;
      padding: 0.875rem 1rem;
      color: var(--color-text);
      font-size: 0.95rem;
      font-weight: 400;
      cursor: pointer;
      text-align: left;
    }

    .key-hint {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 5px;
      background: var(--color-key-hint-bg);
      color: var(--color-key-hint-text);
      font-size: 0.75rem;
      font-weight: 600;
      flex-shrink: 0;
    }

    .choice:hover:not(:disabled) {
      background: var(--color-border-light);
    }

    .choice:focus-visible {
      outline: 3px solid
        color-mix(in srgb, var(--color-accent) 40%, transparent);
      outline-offset: 1px;
    }

    .choice.correct {
      background: var(--color-correct-bg);
      border-color: var(--color-correct);
      color: var(--color-correct-text);
    }

    .choice.wrong {
      background: var(--color-wrong-bg);
      border-color: var(--color-wrong);
      color: var(--color-wrong-text);
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
      background: var(--color-accent);
      color: #fff;
      border: none;
      border-radius: 980px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
    }

    .next-btn:hover:not(:disabled) {
      background: var(--color-accent-hover);
    }

    .next-btn:disabled {
      background: var(--color-disabled-btn);
      cursor: not-allowed;
    }

    .next-btn:focus-visible {
      outline: 3px solid
        color-mix(in srgb, var(--color-accent) 40%, transparent);
      outline-offset: 2px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "flash-card": FlashCard;
  }
}
