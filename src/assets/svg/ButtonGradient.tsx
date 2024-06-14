const ButtonGradient = () => {
    return (
      <svg className="block" width={0} height={0}>
        <defs>
          <linearGradient id="btn-left" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#8B0000" />
            <stop offset="100%" stopColor="#FF0000" />
          </linearGradient>
          <linearGradient id="btn-top" x1="100%" x2="0%" y1="50%" y2="50%">
            <stop offset="0%" stopColor="#8B0000" />
            <stop offset="100%" stopColor="#FF0000" />
          </linearGradient>
          <linearGradient id="btn-bottom" x1="100%" x2="0%" y1="50%" y2="50%">
            <stop offset="0%" stopColor="#DC143C" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
          <linearGradient
            id="btn-right"
            x1="14.635%"
            x2="14.635%"
            y1="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#DC143C" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
        </defs>
      </svg>
    );
  };
  
  export default ButtonGradient;
// const ButtonGradient = () => {
//   return (
//     <svg className="block" width={0} height={0}>
//       <defs>
//         <linearGradient id="btn-left" x1="50%" x2="50%" y1="0%" y2="100%">
//           <stop offset="0%" stopColor="#FF0000" /> {/* 鮮紅色 */}
//           <stop offset="100%" stopColor="#4B0082" /> {/* 靛青色，深藍紫色，過渡用 */}
//         </linearGradient>
//         <linearGradient id="btn-top" x1="100%" x2="0%" y1="50%" y2="50%">
//           <stop offset="0%" stopColor="#FF0000" /> {/* 鮮紅色 */}
//           <stop offset="100%" stopColor="#0000FF" /> {/* 鮮藍色 */}
//         </linearGradient>
//         <linearGradient id="btn-bottom" x1="100%" x2="0%" y1="50%" y2="50%">
//           <stop offset="0%" stopColor="#B22222" /> {/* 火磚紅 */}
//           <stop offset="100%" stopColor="#4169E1" /> {/* 皇家藍 */}
//         </linearGradient>
//         <linearGradient
//           id="btn-right"
//           x1="14.635%"
//           x2="14.635%"
//           y1="0%"
//           y2="100%"
//         >
//           <stop offset="0%" stopColor="#DC143C" /> {/* 猩紅 */}
//           <stop offset="100%" stopColor="#00008B" /> {/* 深藍 */}
//         </linearGradient>
//       </defs>
//     </svg>
//   );
// };

// export default ButtonGradient;

