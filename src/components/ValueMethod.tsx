import React, { useState } from "react";
import Thermometer from "./Thermometer";

interface Evaluation {
  low: number;
  high: number;
}

type Parameters = {
  pb: { netValue: string; ratio: string };
  pe: { eps: string; ratio: string };
  ddm: {
    dividend: string;
    growthRate: string;
    growthYears: string;
    terminalGrowth: string;
  };
  de: {
    eps: string;
    discountRate: string;
    growthRate: string;
    growthYears: string;
    terminalGrowth: string;
  };
  dcf: {
    growthRate: string;
    growthYears: string;
    terminalGrowth: string;
    discountRate: string;
  };
  peg: { growthRate: string; growthYears: string; pegRatio: string };
};

interface v_infoProp {
  v_info: {
    現價: number;
    預期年化報酬率: string;
    高合理價: string;
    合理價: string;
    低合理價: string;
    長期評價: string;
    預估eps: string;
    淨值: string;
    殖利率: string;
    pb法估價: string;
    pe法估價: string;
    ddm法估價: string;
    de法估價: string;
    dcf法估價: string;
    peg法估價: string;
  };
}

const ValueMethod: React.FC<v_infoProp> = ({ v_info }) => {
  const evaluations = [
    { label: "pb法估價", value: v_info.pb法估價 },
    { label: "pe法估價", value: v_info.pe法估價 },
    { label: "ddm法估價", value: v_info.ddm法估價 },
    { label: "de法估價", value: v_info.de法估價 },
    { label: "dcf法估價", value: v_info.dcf法估價 },
    { label: "peg法估價", value: v_info.peg法估價 },
  ];

  const parseEvaluation = (evalStr: string): Evaluation => {
    const [low, high] = evalStr.split("~").map((v) => parseInt(v, 10));
    return { low, high };
  };

  const [parameters, setParameters] = useState<Parameters>({
    pb: { netValue: "", ratio: "" },
    pe: { eps: "", ratio: "" },
    ddm: { dividend: "", growthRate: "", growthYears: "", terminalGrowth: "" },
    de: {
      eps: "",
      discountRate: "",
      growthRate: "",
      growthYears: "",
      terminalGrowth: "",
    },
    dcf: {
      growthRate: "",
      growthYears: "",
      terminalGrowth: "",
      discountRate: "",
    },
    peg: { growthRate: "", growthYears: "", pegRatio: "" },
  });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpansion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleChange = (method: string, field: string, value: string) => {
    setParameters((prevParams) => ({
      ...prevParams,
      [method]: {
        ...prevParams[method],
        [field]: value,
      },
    }));
  };

  const validateInput = (method: keyof Parameters): boolean => {
    const param = parameters[method];

    // 僅當 method 具有 growthRate 和 growthYears 屬性時，才執行該檢查
    if ("growthRate" in param && "growthYears" in param) {
      const growthRateList = param.growthRate
        .split(",")
        .map((v: string) => parseFloat(v));
      const growthYearsList = param.growthYears
        .split(",")
        .map((v: string) => parseInt(v, 10));

      if (growthRateList.length !== growthYearsList.length) {
        alert("成長率與成長年必須是長度一致的列表！");
        return false;
      }

      if (
        !growthRateList.every((rate) => !isNaN(rate)) ||
        !growthYearsList.every((year) => Number.isInteger(year) && year > 0)
      ) {
        alert("成長率必須是浮點數，成長年必須是正整數！");
        return false;
      }
    }

    // 檢查其他參數是否為浮點數
    const floatFields = [
      "netValue",
      "ratio",
      "eps",
      "discountRate",
      "dividend",
      "terminalGrowth",
      "pegRatio",
    ] as const;
    for (const field of floatFields) {
      if (field in param && param[field] && isNaN(parseFloat(param[field]!))) {
        alert(`${field} 必須是浮點數！`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (method: keyof Parameters) => {
    if (validateInput(method)) {
      alert(`${method} 參數已成功提交！`);
      // 在這裡處理提交邏輯
    }
  };

  return (
    <div className="w-[80%] text-color-5">
      <div className="flex space-x-1 items-center justify-center mt-3 h-[3vh]">
        <div className="flex items-center">
          <div className="w-2 h-4 bg-yellow-300 rounded"></div>
          <span className="text-xs">合理區間</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-4 bg-green-500 rounded"></div>
          <span className="text-xs">價格便宜</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-4 bg-red-500 rounded"></div>
          <span className="text-xs">價格過高</span>
        </div>
      </div>
      <div className="space-y-3 mb-1">
        {evaluations.map((evalItem, index) =>
          evalItem.value ? (
            <div key={index} className="my-1 ">
              <div className="h-[8vh]">
                <Thermometer
                  key={index}
                  label={evalItem.label}
                  evaluation={parseEvaluation(evalItem.value)}
                  recentPrice={v_info.現價}
                />
                <button onClick={() => toggleExpansion(index)}>
                  {expandedIndex === index ? "收起" : "展開"}
                </button>
                {expandedIndex === index && (
                  <div className="mt-3">
                    {evalItem.label === "pb法估價" && (
                      <>
                        <input
                          type="text"
                          placeholder="淨值"
                          value={parameters.pb.netValue}
                          onChange={(e) =>
                            handleChange("pb", "netValue", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="比竟比"
                          value={parameters.pb.ratio}
                          onChange={(e) =>
                            handleChange("pb", "ratio", e.target.value)
                          }
                        />
                        <button onClick={() => handleSubmit("pb")}>
                          提交PB
                        </button>
                      </>
                    )}
                    {evalItem.label === "pe法估價" && (
                      <>
                        <input
                          type="text"
                          placeholder="EPS"
                          value={parameters.pe.eps}
                          onChange={(e) =>
                            handleChange("pe", "eps", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="本益比"
                          value={parameters.pe.ratio}
                          onChange={(e) =>
                            handleChange("pe", "ratio", e.target.value)
                          }
                        />
                        <button onClick={() => handleSubmit("pe")}>
                          提交PE
                        </button>
                      </>
                    )}
                    {evalItem.label === "ddm法估價" && (
                      <>
                        <input
                          type="text"
                          placeholder="現金股息"
                          value={parameters.ddm.dividend}
                          onChange={(e) =>
                            handleChange("ddm", "dividend", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="成長率 (如: [6%, 3%])"
                          value={parameters.ddm.growthRate}
                          onChange={(e) =>
                            handleChange("ddm", "growthRate", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="成長年 (如: [3, 2])"
                          value={parameters.ddm.growthYears}
                          onChange={(e) =>
                            handleChange("ddm", "growthYears", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="終端成長"
                          value={parameters.ddm.terminalGrowth}
                          onChange={(e) =>
                            handleChange(
                              "ddm",
                              "terminalGrowth",
                              e.target.value
                            )
                          }
                        />
                        <button onClick={() => handleSubmit("ddm")}>
                          提交DDM
                        </button>
                      </>
                    )}
                    {evalItem.label === "de法估價" && (
                      <>
                        <input
                          type="text"
                          placeholder="EPS"
                          value={parameters.de.eps}
                          onChange={(e) =>
                            handleChange("de", "eps", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="折現率"
                          value={parameters.de.discountRate}
                          onChange={(e) =>
                            handleChange("de", "discountRate", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="成長率 (如: [6%, 3%])"
                          value={parameters.de.growthRate}
                          onChange={(e) =>
                            handleChange("de", "growthRate", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="成長年 (如: [3, 2])"
                          value={parameters.de.growthYears}
                          onChange={(e) =>
                            handleChange("de", "growthYears", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="終端成長"
                          value={parameters.de.terminalGrowth}
                          onChange={(e) =>
                            handleChange("de", "terminalGrowth", e.target.value)
                          }
                        />
                        <button onClick={() => handleSubmit("de")}>
                          提交DE
                        </button>
                      </>
                    )}
                    {evalItem.label === "dcf法估價" && (
                      <>
                        <input
                          type="text"
                          placeholder="成長率 (如: [6%, 3%])"
                          value={parameters.dcf.growthRate}
                          onChange={(e) =>
                            handleChange("dcf", "growthRate", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="成長年 (如: [3, 2])"
                          value={parameters.dcf.growthYears}
                          onChange={(e) =>
                            handleChange("dcf", "growthYears", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="終端成長"
                          value={parameters.dcf.terminalGrowth}
                          onChange={(e) =>
                            handleChange(
                              "dcf",
                              "terminalGrowth",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="text"
                          placeholder="折現率"
                          value={parameters.dcf.discountRate}
                          onChange={(e) =>
                            handleChange("dcf", "discountRate", e.target.value)
                          }
                        />
                        <button onClick={() => handleSubmit("dcf")}>
                          提交DCF
                        </button>
                      </>
                    )}
                    {evalItem.label === "peg法估價" && (
                      <>
                        <input
                          type="text"
                          placeholder="成長率 (如: [6%, 3%])"
                          value={parameters.peg.growthRate}
                          onChange={(e) =>
                            handleChange("peg", "growthRate", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="成長年 (如: [3, 2])"
                          value={parameters.peg.growthYears}
                          onChange={(e) =>
                            handleChange("peg", "growthYears", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="PEG Ratio"
                          value={parameters.peg.pegRatio}
                          onChange={(e) =>
                            handleChange("peg", "pegRatio", e.target.value)
                          }
                        />
                        <button onClick={() => handleSubmit("peg")}>
                          提交PEG
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null
        )}
      </div>
      <div className="h-[20px]"></div>
    </div>
  );
};

export default ValueMethod;
