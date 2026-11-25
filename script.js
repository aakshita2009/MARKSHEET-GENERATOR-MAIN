const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Computer Science"
];

const subjectsContainer = document.getElementById("subjects");
const form = document.getElementById("marksheetForm");
const statusEl = document.getElementById("status");
const emptyState = document.getElementById("emptyState");
const result = document.getElementById("result");

subjects.forEach((subject, index) => {
  const row = document.createElement("div");
  row.className = "subject-row";
  row.innerHTML = `
    <span>${subject}</span>
    <input
      id="mark-${index}"
      type="number"
      min="0"
      max="100"
      step="1"
      placeholder="0"
      required
      aria-label="${subject} marks"
    >
  `;
  subjectsContainer.appendChild(row);
});

function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

function getRemark(percentage, passed) {
  if (!passed) return "Result: Fail. Review the subjects below 40 marks.";
  if (percentage >= 90) return "Excellent performance. Keep up the great work!";
  if (percentage >= 75) return "Very good performance. Keep improving!";
  if (percentage >= 60) return "Good work. A little more practice can take you further.";
  return "You passed. Keep practicing and aim higher next time.";
}

function performanceLabel(mark) {
  if (mark >= 90) return "Excellent";
  if (mark >= 75) return "Very Good";
  if (mark >= 60) return "Good";
  if (mark >= 40) return "Pass";
  return "Needs Improvement";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const roll = document.getElementById("rollNumber").value.trim();

  const marks = subjects.map((_, index) =>
    Number(document.getElementById(`mark-${index}`).value)
  );

  if (!name || !roll || marks.some(mark => !Number.isFinite(mark) || mark < 0 || mark > 100)) {
    statusEl.textContent = "Check your input";
    return;
  }

  const total = marks.reduce((sum, mark) => sum + mark, 0);
  const percentage = total / subjects.length;
  const passed = marks.every(mark => mark >= 40);
  const grade = passed ? getGrade(percentage) : "F";

  document.getElementById("resultName").textContent = name;
  document.getElementById("resultRoll").textContent = roll;
  document.getElementById("total").textContent = total;
  document.getElementById("percentage").textContent = `${percentage.toFixed(2)}%`;
  document.getElementById("resultStatus").textContent = passed ? "PASS" : "FAIL";
  document.getElementById("resultStatus").className = passed ? "good" : "bad";

  const gradeBadge = document.getElementById("gradeBadge");
  gradeBadge.textContent = grade;
  gradeBadge.className = `grade-badge ${passed ? "" : "bad"}`;

  document.getElementById("remark").textContent = getRemark(percentage, passed);

  const resultTable = document.getElementById("resultTable");
  resultTable.innerHTML = subjects.map((subject, index) => {
    const mark = marks[index];
    const good = mark >= 40;
    return `
      <tr>
        <td>${subject}</td>
        <td><strong>${mark}</strong>/100</td>
        <td class="performance ${good ? "good" : "bad"}">${performanceLabel(mark)}</td>
      </tr>
    `;
  }).join("");

  emptyState.classList.add("hidden");
  result.classList.remove("hidden");
  statusEl.textContent = passed ? "Generated" : "Review result";
  document.getElementById("resultCard").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("clearBtn").addEventListener("click", () => {
  form.reset();
  emptyState.classList.remove("hidden");
  result.classList.add("hidden");
  statusEl.textContent = "Ready";
});

document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("themeToggle").textContent =
    document.body.classList.contains("dark") ? "☀" : "☾";
});
