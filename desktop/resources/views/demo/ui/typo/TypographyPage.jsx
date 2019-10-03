import React from "react";

function TypographyPage() {
    return (
        <div>
            <div className="demo-content typography">
                <hr />
                <h2>Typography Heading</h2>
                <hr />
                <section>
                    <h1 className="h1">Heading Tag H1</h1>
                    <h2 className="h2">Heading Tag H2</h2>
                    <h3 className="h3">Heading Tag H3</h3>
                    <h4 className="h4">Heading Tag H4</h4>
                    <h5 className="h5">Heading Tag H5</h5>
                    <h6 className="h6">Heading Tag H6</h6>
                </section>
                <hr />
                <h2>Heading Caption Class</h2>
                <hr />
                <section>
                    <p className="h1-caption">Heading Caption Class Name h1-caption</p>
                    <p className="h2-caption">Heading Caption Class Name h2-caption</p>
                    <p className="h3-caption">Heading Caption Class Name h3-caption</p>
                    <p className="h4-caption">Heading Caption Class Name h4-caption</p>
                    <p className="h5-caption">Heading Caption Class Name h5-caption</p>
                    <p className="h6-caption">Heading Caption Class Name h6-caption</p>
                </section>
                <hr />
                <h2>Heading Cap</h2>
                <hr />
                <section>
                    <h1 className="cap" title="01">Heading Tag H1</h1>
                    <h2 className="cap-bar" width="30" title="Heading Tag H2">Heading Tag H2</h2>
                    <h3 className="cap" title="01">Heading Tag H3</h3>
                    <h4 className="cap-bar bar-w20" title="Heading Tag H2">Heading Tag H4</h4>
                    <h5 className="cap" title="01">Heading Tag H5</h5>
                    <h6 className="cap-bar bar-w10" title="Heading Tag H2">Heading Tag H6</h6>
                </section>
                <hr />
                <h2>text-weight CLASS</h2>
                <hr />
                <section>
                    <h1 className="text-light">Heading Tag H1 add class text-light</h1>
                    <h1 className="text-normal">Heading Tag H1 add class text-normal</h1>
                    <h1 className="text-bold">Heading Tag H1 add class text-bold</h1>
                </section>
                <hr />
                <h2>GRID</h2>
                <hr />
                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                            <div className="col-1 columns">col-1</div>
                        </div>
                        <div className="row">
                            <div className="col-2 columns">col-2</div>
                            <div className="col-3 columns">col-3</div>
                            <div className="col-2 columns">col-2</div>
                            <div className="col-5 columns">col-5</div>
                        </div>
                        <div className="row">
                            <div className="col-9 columns">col-9
                                <div className="row">
                                    <div className="col-5 columns">col-5</div>
                                    <div className="col-3 columns">col-3</div>
                                    <div className="col-4 columns">col-4</div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4 columns">col-4</div>
                            <div className="col-4 offset-4 columns">col-4 offset-4</div>
                        </div>
                        <div className="row">
                            <div className="col-3 offset-3 columns">col-3 offset-3</div>
                            <div className="col-3 offset-3 columns">col-3 offset-3</div>
                        </div>
                        <div className="row">
                            <div className="col-6 offset-3 columns">col-6 offset-3</div>
                        </div>
                    </div>
                </section>
                <hr />
            </div>
        </div>
    );
}

export default TypographyPage;
