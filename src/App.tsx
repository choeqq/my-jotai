import "./App.css";
import { atom, useAtom } from "./jotai";

const salaryAtom = atom(100_000);

function SalaryDisplay() {
  const [salary] = useAtom(salaryAtom);
  return <div>Salary: {salary}</div>;
}

function App() {
  const [salary, setSalary] = useAtom(salaryAtom);

  return (
    <div id="root">
      <div>
        <input value={salary} onChange={(e) => setSalary(+e.target.value)} />
      </div>
      <div>Salary: {salary}</div>
      <SalaryDisplay />
    </div>
  );
}

export default App;
