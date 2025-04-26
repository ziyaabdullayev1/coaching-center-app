export async function createGoal(goalData) {
    try {
      const res = await fetch("http://localhost:3001/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error creating goal:", err);
      return null;
    }
  }
  
  export async function fetchStudents() {
    try {
      const res = await fetch("http://localhost:3001/api/students");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching students:", err);
      return [];
    }
  }
  