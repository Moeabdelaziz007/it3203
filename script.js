document.getElementById("quiz-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  let score = 0;
  let feedback = "";

  // Question 1
  const q1 = document.querySelector('input[name="q1"]:checked');
  if (q1 && q1.value === "a") score++;
  feedback += "<p>Q1: " + (q1 ? q1.value : "No Answer") + " - " + (q1 && q1.value === "a" ? "Correct" : "Incorrect. Answer: a") + "</p>";

  // Question 2
  const q2 = document.querySelector('input[name="q2"]:checked');
  if (q2 && q2.value === "c") score++;
  feedback += "<p>Q2: " + (q2 ? q2.value : "No Answer") + " - " + (q2 && q2.value === "c" ? "Correct" : "Incorrect. Answer: c") + "</p>";

  // Question 3
  const q3 = document.querySelector('input[name="q3"]').value.trim().toLowerCase();
  if (q3 === "markup") score++;
  feedback += "<p>Q3: " + q3 + " - " + (q3 === "markup" ? "Correct" : "Incorrect. Answer: markup") + "</p>";

  // Question 4 (checkboxes)
  const q4 = document.querySelectorAll('input[name="q4"]:checked');
  const selectedQ4 = Array.from(q4).map(cb => cb.value);
  const correctQ4 = ["header", "footer", "section"];
  const isCorrectQ4 = selectedQ4.length === correctQ4.length && correctQ4.every(val => selectedQ4.includes(val));
  if (isCorrectQ4) score++;
  feedback += "<p>Q4: " + selectedQ4.join(", ") + " - " + (isCorrectQ4 ? "Correct" : "Incorrect. Answer: header, footer, section") + "</p>";

  // Question 5
  const q5 = document.querySelector('input[name="q5"]:checked');
  if (q5 && q5.value === "b") score++;
  feedback += "<p>Q5: " + (q5 ? q5.value : "No Answer") + " - " + (q5 && q5.value === "b" ? "Correct" : "Incorrect. Answer: b") + "</p>";

  const pass = score >= 3 ? "✅ Passed" : "❌ Failed";

  resultDiv.innerHTML = "<h2>Your Score: " + score + "/5</h2>" + feedback + "<h3>" + pass + "</h3>";
  resultDiv.style.display = "block";
});

document.getElementById("restart-btn").addEventListener("click", function() {
  document.getElementById("quiz-form").reset();
  document.getElementById("result").style.display = "none";
});
