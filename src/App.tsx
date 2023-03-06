import { atom, useAtom } from "./jotai";

const salaryAtom = atom(100_000);

function App() {
  const [salary, setSalary] = useAtom(salaryAtom);

  return (
    <div>
      <div>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(+e.target.value)}
        />
      </div>
      <div>Salary: {salary}</div>
    </div>
  );
}

export default App;
