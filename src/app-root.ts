import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

interface CardItem {
  question: string;
  choices: string[];
  correctIndex: number;
}

@customElement("app-root")
export class AppRoot extends LitElement {
  @state() cards: CardItem[] = [];
  @state() stats = {
    correct: 0,
    wrong: 0,
  };
  @state() currentCardIndex = 0;

  async firstUpdated() {
    const response = await fetch(
      "https://fh-salzburg-3e27a-default-rtdb.europe-west1.firebasedatabase.app/flashcards.json",
    );
    const result = await response.json();
    this.cards = result;
  }

  handleAnswerSelected(event: CustomEvent) {
    if (event.detail.isCorrect) {
      this.stats = { ...this.stats, correct: this.stats.correct + 1 };
    } else {
      this.stats = { ...this.stats, wrong: this.stats.wrong + 1 };
    }
    this.currentCardIndex++;
  }

  render() {
    return html`<section>
      <slot></slot>
      <p>Correct: ${this.stats.correct} | Wrong: ${this.stats.wrong}</p>
      <div>
        ${this.cards[this.currentCardIndex]
          ? html` <card-item
              .question=${this.cards[this.currentCardIndex]?.question}
              .choices=${this.cards[this.currentCardIndex]?.choices}
              correctIndex=${this.cards[this.currentCardIndex]?.correctIndex}
              @answer-selected=${this.handleAnswerSelected}
            ></card-item>`
          : html`<p>No more cards available.</p>`}
      </div>
    </section>`;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "app-root": AppRoot;
  }
}
