import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import type { FlashCard, QuizStats } from "./types.js";
import "./quiz-progress.js";
import "./quiz-results.js";
import "./flash-card.js";

@customElement("app-root")
export class AppRoot extends LitElement {
  @state() cards: FlashCard[] = [];
  @state() loading = true;
  @state() error = "";
  @state() stats: QuizStats = { correct: 0, wrong: 0 };
  @state() currentCardIndex = 0;

  get isFinished() {
    return this.cards.length > 0 && this.currentCardIndex >= this.cards.length;
  }

  async firstUpdated() {
    await this.fetchCards();
  }

  async fetchCards() {
    this.loading = true;
    this.error = "";
    try {
      const response = await fetch(
        "https://fh-salzburg-3e27a-default-rtdb.europe-west1.firebasedatabase.app/flashcards.json",
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.cards = await response.json();
    } catch {
      this.error = "Failed to load cards";
    } finally {
      this.loading = false;
    }
  }

  handleAnswerSelected(event: CustomEvent) {
    if (event.detail.isCorrect) {
      this.stats = { ...this.stats, correct: this.stats.correct + 1 };
    } else {
      this.stats = { ...this.stats, wrong: this.stats.wrong + 1 };
    }
    this.currentCardIndex++;
  }

  handleRestart() {
    this.currentCardIndex = 0;
    this.stats = { correct: 0, wrong: 0 };
  }

  render() {
    return html`
      <main>
        <header>
          <slot></slot>
        </header>

        <section class="content">
          ${this.loading
            ? html`<div class="loader">
                <div class="spinner"></div>
                <p>Loading flashcards…</p>
              </div>`
            : this.error
              ? html`<div class="error">
                  <p>${this.error}</p>
                  <button class="btn" @click=${this.fetchCards}>Retry</button>
                </div>`
              : this.isFinished
                ? html`<quiz-results
                    .stats=${this.stats}
                    .total=${this.cards.length}
                    @quiz-restart=${this.handleRestart}
                  ></quiz-results>`
                : html`
                    <quiz-progress
                      .current=${this.currentCardIndex}
                      .total=${this.cards.length}
                    ></quiz-progress>
                    ${keyed(
                      this.currentCardIndex,
                      html`<flash-card
                        .question=${this.cards[this.currentCardIndex].question}
                        .choices=${this.cards[this.currentCardIndex].choices}
                        .correctIndex=${this.cards[this.currentCardIndex]
                          .correctIndex}
                        @answer-selected=${this.handleAnswerSelected}
                      ></flash-card>`,
                    )}
                  `}
        </section>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
      max-width: 600px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
    }

    main {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
    }

    header {
      text-align: center;
      margin-bottom: 2rem;
    }

    ::slotted(h2) {
      font-size: 2rem;
      margin: 0;
    }

    .content {
      flex: 1;
    }

    .loader {
      text-align: center;
      padding: 4rem 0;
      color: var(--color-text-secondary);
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--color-border-light);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .error {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--color-wrong);
      font-size: 0.95rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.75rem;
      background: var(--color-accent);
      color: #fff;
      border: none;
      border-radius: 980px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
    }

    .btn:hover {
      background: var(--color-accent-hover);
    }

    .btn:focus-visible {
      outline: 3px solid
        color-mix(in srgb, var(--color-accent) 40%, transparent);
      outline-offset: 2px;
    }

    @media (max-width: 500px) {
      :host {
        padding: 1.5rem 1rem;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "app-root": AppRoot;
  }
}
