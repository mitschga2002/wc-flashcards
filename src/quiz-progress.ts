import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("quiz-progress")
export class QuizProgress extends LitElement {
  @property({ type: Number }) current = 0;
  @property({ type: Number }) total = 0;

  get percent() {
    return this.total > 0 ? (this.current / this.total) * 100 : 0;
  }

  render() {
    return html`
      <div class="progress">
        <span class="label">
          Question ${this.current + 1} of ${this.total}
        </span>
        <div
          class="bar"
          aria-valuenow=${this.current}
          aria-valuemin=${0}
          aria-valuemax=${this.total}
        >
          <div class="fill" style="width: ${this.percent}%"></div>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      margin-bottom: 1.5rem;
    }

    .label {
      display: block;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      margin-bottom: 0.5rem;
    }

    .bar {
      height: 4px;
      background: var(--color-border-light);
      border-radius: 2px;
      overflow: hidden;
    }

    .fill {
      height: 100%;
      background: var(--color-accent);
      border-radius: 2px;
      transition: width 0.4s ease;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "quiz-progress": QuizProgress;
  }
}
