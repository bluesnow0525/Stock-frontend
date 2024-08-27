import React, { useState } from 'react';

const QuestionnaireForm: React.FC = () => {
  const [scores, setScores] = useState({
    q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0, q10: 0,
  });

  const [answers, setAnswers] = useState({
    profit: '',
    loss: '',
  });

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScores({ ...scores, [e.target.name]: parseInt(e.target.value) });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Scores:', scores);
    console.log('Submitted Answers:', answers);

    // Result analysis logic here
    // Example: calculate total scores and determine the type
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">投資偏好問卷</h2>
      {[...Array(10).keys()].map((i) => (
        <div key={i + 1} className="mb-4">
          <label htmlFor={`q${i + 1}`} className="block text-gray-700">
            Q{i + 1}:
          </label>
          <input
            type="number"
            id={`q${i + 1}`}
            name={`q${i + 1}`}
            min="1"
            max="5"
            value={scores[`q${i + 1}`]}
            onChange={handleScoreChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      ))}

      <h3 className="text-lg font-semibold mb-2">額外選擇題</h3>
      <div className="mb-4">
        <label htmlFor="profit" className="block text-gray-700">
          您預期的最高獲利百分比是？
        </label>
        <select
          id="profit"
          name="profit"
          value={answers.profit}
          onChange={handleSelectChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">選擇</option>
          <option value="A">少於 10%</option>
          <option value="B">10% - 20%</option>
          <option value="C">20% - 30%</option>
          <option value="D">30% - 50%</option>
          <option value="E">超過 50%</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="loss" className="block text-gray-700">
          您可以接受的最大虧損百分比是？
        </label>
        <select
          id="loss"
          name="loss"
          value={answers.loss}
          onChange={handleSelectChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">選擇</option>
          <option value="A">少於 5%</option>
          <option value="B">5% - 10%</option>
          <option value="C">10% - 20%</option>
          <option value="D">20% - 30%</option>
          <option value="E">超過 30%</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        提交
      </button>
    </form>
  );
};

export default QuestionnaireForm;
