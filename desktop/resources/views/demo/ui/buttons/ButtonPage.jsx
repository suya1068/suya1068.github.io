import React from "react";
import Buttons, { classSize, classWidth, classShape, classTheme } from "desktop/resources/components/button/Buttons";

function resultFunc() {
    console.log("Click Button");
}

function ButtonPage() {
    return (
        <div>
            <div className="demo-content">
                <Buttons buttonStyle={{ icon: "share" }} >버튼테스트</Buttons>
                {Object.keys(classShape).map((shape, i) => {
                    return (
                        <div key={i}>
                            {Object.keys(classSize).map((size, j) => {
                                return (
                                    <section>
                                        <h4 key={j}>Button (size, shape) - {size} {shape}</h4>
                                        {Object.keys(classWidth).map((width, k) => {
                                            return (<div key={k}><Buttons buttonStyle={{ size, width, shape, theme: "default", icon: "heart" }}>{size} {width}</Buttons></div>);
                                        })}
                                    </section>
                                );
                            })}
                        </div>
                    );
                })}

                {Object.keys(classTheme).map((theme, i) => {
                    return (
                        <div>
                            <section>
                                <h4 key={i}>Button Theme - {theme}</h4>
                                {Object.keys(classWidth).map((width, j) => {
                                    return (
                                        <div key={j}><Buttons buttonStyle={{ width, theme }}>{width} {theme}</Buttons></div>
                                    );
                                })}
                            </section>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ButtonPage;
