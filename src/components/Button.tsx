import React from 'react';  // 引入 React
import ButtonSvg from "../assets/svg/ButtonSvg"; // 确保路径正确

// 定义传入 Button 组件的 props 类型
interface ButtonProps {
  className?: string;
  href?: string;
  children: React.ReactNode; // children 可以是任何可渲染的 React 内容
  px?: string; // 指定 px 是可选的且为字符串
  white?: boolean; // white 也是可选的布尔值
}

const Button: React.FC<ButtonProps> = ({ className, href, children, px, white }) => {
  const classes = `relative inline-flex items-center justify-center h-11 transition-colors hover:text-color-3 ${
    px || "px-7"
  } ${white ? "text-n-8" : "text-n-1"} ${className || ""}`;
  const spanClasses = "relative z-10";

  const renderButton = () => (
    <div className={classes}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </div>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default Button;
