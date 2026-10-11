const COPY = {
  practice: ['Practice', '⚡', 'Quick 10-question rounds by topic, with unlimited questions. Arrives in step 2.'],
  exam: ['Exam', '📝', 'YDS-style sections and full timed mock tests. Arrives in step 5.'],
  progress: ['Progress', '📈', 'Accuracy by topic and exam section, plus your estimated score out of 80. Arrives in step 2 and 6.'],
};

export function render(root, ctx, params, name) {
  const [title, icon, text] = COPY[name];
  root.innerHTML = `<h1>${title}</h1><div class="empty"><div style="font-size:2.4rem">${icon}</div><p>${text}</p></div>`;
}
