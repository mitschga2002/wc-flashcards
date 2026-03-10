import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { QuizStats } from "./types.js";

@customElement("quiz-results")
export class QuizResults extends LitElement {
  @property({ attribute: false }) stats: QuizStats = { correct: 0, wrong: 0 };
  @property({ type: Number }) total = 0;

  get scorePercent() {
    const answered = this.stats.correct + this.stats.wrong;
    if (answered === 0) return 0;
    return Math.round((this.stats.correct / answered) * 100);
  }

  handleRestart() {
    this.dispatchEvent(new CustomEvent("quiz-restart"));
  }

  render() {
    return html`
      <div class="results">
        <p class="score">${this.scorePercent}%</p>
        <div class="stats">
          <div class="stat">
            <span class="stat-value correct">${this.stats.correct}</span>
            <span class="stat-label">Correct</span>
          </div>
          <div class="stat">
            <span class="stat-value wrong">${this.stats.wrong}</span>
            <span class="stat-label">Wrong</span>
          </div>
          <div class="stat">
            <span class="stat-value total">${this.total}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
        <button class="btn" @click=${this.handleRestart}>Try Again</button>
      </div>
    `;
  }

  static styles = css`
    .results {
      text-align: center;
      padding: 3rem 2rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      animation: slideIn 0.3s ease-out;
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

    .score {
      font-size: 3rem;
      font-weight: 700;
      color: var(--color-accent);
      margin: 0.25rem 0 2rem;
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-bottom: 2rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    .correct {
      color: var(--color-correct);
    }

    .wrong {
      color: var(--color-wrong);
    }

    .total {
      color: var(--color-text);
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.75rem;
      background: var(--color-accent);
      color: #fff;
      border: none;
      border-radius: 980px;
      font-size: 0.95rem;
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
      .stats {
        gap: 1.5rem;
      }

      .results {
        padding: 2rem 1.25rem;
      }

      .score {
        font-size: 2.5rem;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "quiz-results": QuizResults;
  }
}
