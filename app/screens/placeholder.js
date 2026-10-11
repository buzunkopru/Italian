const COPY = {
  exam: ['Exam', '📝', 'YDS-style sections and full timed mock tests. Arrives in step 5.'],
};

export function render(root, ctx, params, name) {
  const [title, icon, text] = COPY[name];
  root.innerHTML = `<h1>${title}</h1><div class="empty"><div style="font-size:2.4rem">${icon}</div><p>${text}</p></div>`;
}
