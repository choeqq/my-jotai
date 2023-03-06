import "./App.css";
import { atom, useAtom, useAtomValue } from "./jotai";

const salaryAtom = atom(100_000);
const bonusAtom = atom(10_000);
const totalSalaryAtom = atom((get) => get(salaryAtom) + get(bonusAtom));
const dataAtom = atom(() => fetch("/data.json").then((res) => res.json()));
const keysAtom = atom((get) => Object.keys(get(dataAtom) ?? {}));

function SalaryDisplay() {
  const salary = useAtomValue(salaryAtom);
  return <div>SalaryDisplay: {salary}</div>;
}

function App() {
  const [salary, setSalary] = useAtom(salaryAtom);
  const [bonus, setBonus] = useAtom(salaryAtom);
  const totalSalary = useAtomValue(totalSalaryAtom);
  const data = useAtomValue(dataAtom);
  const keys = useAtomValue(keysAtom);

  return (
    <div id="root">
      <div>
        <input value={salary} onChange={(e) => setSalary(+e.target.value)} />
      </div>
      <div>{salary && `Salary: ${salary}`}</div>
      <SalaryDisplay />
      <div>
        <input value={bonus} onChange={(e) => setBonus(+e.target.value)} />
      </div>
      <div>{bonus && `Bonus: ${salary}`}</div>
      <div>{totalSalary && `TotalSalary: ${totalSalary}`}</div>
      <div>{data && `Data: ${JSON.stringify(data, null, 2)}`}</div>
      <div>{keys && `Keys: ${JSON.stringify(keys, null, 2)}`}</div>
    </div>
  );
}

export default App;
