import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { QuizStats } from "./types.js";

@customElement("quiz-results")
export class QuizResults extends LitElement {
  @property({ attribute: false }) stats: QuizStats = { correct: 0, wrong: 0 };
  @property({ type: Number }) total = 0;

  get scorePercent(): number {
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
    :host {
      display: block;
    }

    .results {
      text-align: center;
      padding: 3rem 2rem;
      background: white;
      border: 1px solid #d2d2d7;
      border-radius: 16px;
    }

    .score {
      font-size: 3rem;
      font-weight: 700;
      color: #0071e3;
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
      color: #86868b;
    }

    .correct {
      color: #34c759;
    }

    .wrong {
      color: #ff3b30;
    }

    .total {
      color: #1d1d1f;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.75rem;
      background: #0071e3;
      color: white;
      border: none;
      border-radius: 980px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
    }

    .btn:hover {
      background: #0077ed;
    }

    .btn:focus-visible {
      outline: 3px solid rgba(0, 113, 227, 0.4);
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
