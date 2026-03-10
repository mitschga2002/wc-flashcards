import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

@customElement("card-item")
export class CardItem extends LitElement {
  @property() question = "";
  @property({ attribute: false }) choices: string[] = [];
  @property({ type: Number }) correctIndex = 0;

  handleClick(index: number) {
    this.dispatchEvent(
      new CustomEvent("answer-selected", {
        detail: {
          isCorrect: index === this.correctIndex,
        },
      }),
    );
  }

  render() {
    return html` <div class="card">
      <h4>${this.question}</h4>
      <div class="choices">
        ${map(
          this.choices,
          (choice, index) =>
            html`<button @click=${() => this.handleClick(index)}>
              <p>${choice}</p>
            </button>`,
        )}
      </div>
    </div>`;
  }
  static styles = css`
    .card {
      background-color: white;
      border-radius: 1rem;
      padding: 1rem;
    }

    h4 {
      color: black;
    }

    .choices {
      display: flex;
      gap: 1rem;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "card-item": CardItem;
  }
}
