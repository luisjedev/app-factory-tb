document.querySelectorAll('[data-quiz]').forEach((quiz) => {
  const feedback = quiz.querySelector('.feedback');
  quiz.querySelectorAll('button[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      quiz.querySelectorAll('button[data-choice]').forEach((item) => {
        item.classList.remove('correct', 'incorrect');
      });
      const correct = button.dataset.choice === quiz.dataset.answer;
      button.classList.add(correct ? 'correct' : 'incorrect');
      feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
      feedback.textContent = correct
        ? `Correcto. ${quiz.dataset.success}`
        : `Todavía no. ${quiz.dataset.hint}`;
    });
  });
});
