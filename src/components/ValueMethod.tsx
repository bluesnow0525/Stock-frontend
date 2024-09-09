import React, { useEffect, useState, useRef } from "react";
import Thermometer from "./Thermometer";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvaluationRange, setDefaultEvaluations } from "../slice/valuechangeSlice"; // 引入 actions 和 thunk
import { RootState, AppDispatch } from "../store";

interface Evaluation {
  low: number;
  high: number;
}

type Parameters = {
  pb: { netValue: number | string; ratio: number | string };
  pe: { eps: number | string; ratio: number | string };
  ddm: { dividend: number | string; growthRate: (number | string)[]; growthYears: (number | string)[]; terminalGrowth: number | string; discountRate: number | string };
  de: { eps: number | string; discountRate: number | string; growthRate: (number | string)[]; growthYears: (number | string)[]; terminalGrowth: number | string };
  dcf: { current_cashflow: number | string; growthRate: (number | string)[]; growthYears: (number | string)[]; terminalGrowth: number | string; discountRate: number | string };
  peg: { growthRate: number | string };
};


interface v_infoProp {
  v_info: {
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
  recentPrice: number;
  stock_id: string;
}

const ValueMethod: React.FC<v_infoProp> = ({ v_info, recentPrice, stock_id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const evaluations = useSelector((state: RootState) => state.valuation.evaluations);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      dispatch(setDefaultEvaluations({
        pb法估價: v_info.pb法估價,
        pe法估價: v_info.pe法估價,
        ddm法估價: v_info.ddm法估價,
        de法估價: v_info.de法估價,
        dcf法估價: v_info.dcf法估價,
        peg法估價: v_info.peg法估價,
      }));
      initialized.current = true; // 标记为已初始化
    }
  }, [dispatch, v_info]);

  const parseEvaluation = (evalStr: string): Evaluation => {
    const [low, high] = evalStr.split("~").map((v) => parseInt(v, 10));
    return { low, high };
  };

  const [parameters, setParameters] = useState<Parameters>({
    pb: { netValue: '', ratio: '' },
    pe: { eps: '', ratio: '' },
    ddm: { dividend: '', growthRate: [], growthYears: [], terminalGrowth: '', discountRate: '' },
    de: { eps: '', discountRate: '', growthRate: [], growthYears: [], terminalGrowth: '' },
    dcf: { current_cashflow: '', growthRate: [], growthYears: [], terminalGrowth: '', discountRate: '' },
    peg: { growthRate: '' },
  });


  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpansion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleChange = (method: keyof Parameters, field: string, value: string) => {
    setParameters((prevParams) => {
      let newValue: number | string | (number | string)[] = value;

      // 处理 growthRate 和 growthYears 为数组的情况
      if (field === "growthRate" || field === "growthYears") {
        newValue = value
          ? value.split(",").map((v) => v.trim())
          : []; // 保留输入的原始字符串
      } else {
        // 对于其他字段，保留字符串直到它是有效的浮点数
        newValue = value === "" || value === "." ? value : parseFloat(value);
      }

      return {
        ...prevParams,
        [method]: {
          ...prevParams[method],
          [field]: newValue,
        },
      };
    });
  };

  const validateInput = (method: keyof Parameters): boolean => {
    const param = parameters[method];

    if ("growthRate" in param && "growthYears" in param) {
      const growthRateList = param.growthRate;
      const growthYearsList = param.growthYears;

      if (growthRateList.length !== growthYearsList.length) {
        alert("成長率與成長年必須是長度一致的列表！");
        return false;
      }

      // 验证 growthRate 列表中的所有元素是否是有效的浮点数
      const isValidGrowthRate = growthRateList.every((rate) =>
        typeof rate === "number"
          ? !isNaN(rate) // 确保 number 类型是有效的数值
          : /^\d*\.?\d+$/.test(rate.trim()) // 确保字符串类型是有效的浮点数
      );

      // 验证 growthYears 列表中的所有元素是否是有效的正整数
      const isValidGrowthYears = growthYearsList.every((year) =>
        typeof year === "number"
          ? Number.isInteger(year) && year > 0 // 确保 number 类型是正整数
          : /^\d+$/.test(year.trim()) // 确保字符串类型是正整数
      );

      if (!isValidGrowthRate || !isValidGrowthYears) {
        alert("成長率必須是浮點數，成長年必須是正整數！");
        return false;
      }
    }

    // 检查其他参数是否为浮点数
    const floatFields = ["netValue", "ratio", "eps", "discountRate", "dividend", "terminalGrowth", "pegRatio"] as const;
    for (const field of floatFields) {
      if (field in param) {
        const value = param[field];
        if (typeof value === "string") {
          // 验证字符串形式的浮点数
          if (value === "" || value === ".") {
            alert(`${field} 必须是浮点数！`);
            return false;
          } else if (isNaN(parseFloat(value))) {
            alert(`${field} 必须是浮点数！`);
            return false;
          }
        } else if (typeof value === "number" && isNaN(value)) {
          // 验证数字形式的浮点数
          alert(`${field} 必须是浮点数！`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = (method: keyof Parameters) => {
    if (!validateInput(method)) {
      return;
    }

    const param = parameters[method];
    const methodWithSuffix = `${method}法估價`;

    // 派发 thunk 动作，仅更新指定 method 的值
    dispatch(fetchEvaluationRange({ stock_id: stock_id, method: methodWithSuffix, parameters: param }));
  };

  return (
    <div className="w-full text-color-5 h-full">
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
        {Object.entries(evaluations).map(([label, value], index) => (
          <div key={index} className="my-1 ">
            <div className="mb-10 border-t border-color-3">
              <div className="flex">
                <button
                  className="w-[10%] mt-7 ml-5 text-center font-bold text-[15px]"
                  onClick={() => toggleExpansion(index)}
                >
                  {expandedIndex === index ? "收起" : "調整"}
                </button>
                <Thermometer
                  key={index}
                  label={label}
                  evaluation={parseEvaluation(value || '0~0')}
                  recentPrice={recentPrice}
                />
              </div>
              {expandedIndex === index && (
                <div className="mt-8 z-50 text-black">
                  {label === "pb法估價" && (
                    <>
                      <input
                        type="number"
                        placeholder="淨值"
                        value={parameters.pb.netValue}
                        onChange={(e) =>
                          handleChange("pb", "netValue", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="本淨比"
                        value={parameters.pb.ratio}
                        onChange={(e) =>
                          handleChange("pb", "ratio", e.target.value)
                        }
                      />
                      <button
                        className="bg-slate-50"
                        onClick={() => handleSubmit("pb")}
                      >
                        提交PB
                      </button>
                    </>
                  )}
                  {label === "pe法估價" && (
                    <>
                      <input
                        type="number"
                        placeholder="EPS"
                        value={parameters.pe.eps}
                        onChange={(e) =>
                          handleChange("pe", "eps", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="本益比"
                        value={parameters.pe.ratio}
                        onChange={(e) =>
                          handleChange("pe", "ratio", e.target.value)
                        }
                      />
                      <button
                        className="bg-white"
                        onClick={() => handleSubmit("pe")}
                      >
                        提交PE
                      </button>
                    </>
                  )}
                  {label === "ddm法估價" && (
                    <>
                      <input
                        type="number"
                        placeholder="現金股息"
                        value={parameters.ddm.dividend}
                        onChange={(e) =>
                          handleChange("ddm", "dividend", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="成長率 (如: 0.06, 0.03)"
                        value={parameters.ddm.growthRate.join(",")}
                        onChange={(e) =>
                          handleChange("ddm", "growthRate", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="成長年 (如: 3, 2)"
                        value={parameters.ddm.growthYears.join(",")}
                        onChange={(e) =>
                          handleChange("ddm", "growthYears", e.target.value)
                        }
                      />
                      <input
                        type="number"
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
                      <input
                        type="number"
                        placeholder="折現率"
                        value={parameters.ddm.discountRate}
                        onChange={(e) =>
                          handleChange(
                            "ddm",
                            "discountRate",
                            e.target.value
                          )
                        }
                      />
                      <button
                        className="bg-slate-50 "
                        onClick={() => handleSubmit("ddm")}
                      >
                        提交DDM
                      </button>
                    </>
                  )}
                  {label === "de法估價" && (
                    <>
                      <input
                        type="number"
                        placeholder="EPS"
                        value={parameters.de.eps}
                        onChange={(e) =>
                          handleChange("de", "eps", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="折現率"
                        value={parameters.de.discountRate}
                        onChange={(e) =>
                          handleChange("de", "discountRate", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="成長率 (如: 0.06, 0.03)"
                        value={parameters.de.growthRate.join(",")}
                        onChange={(e) =>
                          handleChange("de", "growthRate", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="成長年 (如: 3, 2)"
                        value={parameters.de.growthYears.join(",")}
                        onChange={(e) =>
                          handleChange("de", "growthYears", e.target.value)
                        }
                      />

                      <input
                        type="number"
                        placeholder="終端成長"
                        value={parameters.de.terminalGrowth}
                        onChange={(e) =>
                          handleChange("de", "terminalGrowth", e.target.value)
                        }
                      />
                      <button
                        className="bg-slate-50 "
                        onClick={() => handleSubmit("de")}
                      >
                        提交DE
                      </button>
                    </>
                  )}
                  {label === "dcf法估價" && (
                    <>
                      <input
                        type="number"
                        placeholder="現金流"
                        value={parameters.dcf.current_cashflow}
                        onChange={(e) =>
                          handleChange("dcf", "current_cashflow", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="成長率 (如: 0.06, 0.03)"
                        value={parameters.dcf.growthRate.join(",")}
                        onChange={(e) =>
                          handleChange("dcf", "growthRate", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="成長年 (如: 3, 2)"
                        value={parameters.dcf.growthYears.join(",")}
                        onChange={(e) =>
                          handleChange("dcf", "growthYears", e.target.value)
                        }
                      />
                      <input
                        type="number"
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
                        type="number"
                        placeholder="折現率"
                        value={parameters.dcf.discountRate}
                        onChange={(e) =>
                          handleChange("dcf", "discountRate", e.target.value)
                        }
                      />
                      <button
                        className="bg-slate-50 "
                        onClick={() => handleSubmit("dcf")}
                      >
                        提交DCF
                      </button>
                    </>
                  )}
                  {label === "peg法估價" && (
                    <>
                      <input
                        type="number"
                        placeholder="成長率"
                        value={parameters.peg.growthRate}
                        onChange={(e) =>
                          handleChange("peg", "growthRate", e.target.value)
                        }
                      />
                      <button
                        className="bg-slate-50 "
                        onClick={() => handleSubmit("peg")}
                      >
                        提交PEG
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="h-[20px]"></div>
    </div>
  );
};

export default ValueMethod;
