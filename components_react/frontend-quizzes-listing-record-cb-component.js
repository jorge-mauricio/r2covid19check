"use strict";

//Import Node Modules.
//----------------------
//const gSystemConfig = require("../config-application.js"); //System configuration.
//const FunctionsGeneric = require("../" + gSystemConfig.configDirectoryComponents + "/functions-generic.js");
//const FunctionsCrypto = require("../" + gSystemConfig.configDirectoryComponents + "/functions-crypto.js");

//Context.
import { SyncSystemNSContext } from "./syncsystem-ns-cb-context.js";

//import React from "react";
import React, {Component} from "react";
import ReactDOM from "react-dom";
//import { Link } from 'react-router-dom';
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";

//Components.
import FrontendContent from "./frontend-content-cb-component.js";
//----------------------


class FrontendQuizzesListingRecord extends Component
{
    //Context.
    static contextType = SyncSystemNSContext;

    /*state = {
        quizAnswersRight: 0
    };*/

    //Constructor.
    //**************************************************************************************
    constructor(props, context)
    {
        //Component options.
        //configLayoutType: 1 - table listing (custom) | 2 - div layout (custom) | 3 - div row (custom) | 11 - table listing (bootstrap) | 22 - div layout (bootstrap) | 33 - div row (bootstrap) | 111 - table listing (dashboard - custom) 


        super(props, context);
        /*
        {
            this.arrCategoriesListing = props.arrCategoriesListing;
        }
        this.arrCategoriesListing = props.arrCategoriesListing;
        */
        //Bind.
        this.handleQuizAnswer = this.handleQuizAnswer.bind(this);
        this.handleQuizResultLog = this.handleQuizResultLog.bind(this);
        this.handleQuizResultReset = this.handleQuizResultReset.bind(this);


        //Properties.
        this.idTbRegistersLoggedCrypt = "";
        this.idTbRegistersLogged = "";

        this.quizCheck = true;


        //State creation.
        /**/
        this.state = {
            quizAnswersRight: 0,
            quizResultsLog: []
        };


        //Debug.
        //console.log("props=", props);
    }
    //**************************************************************************************


    //Lifecycle method.
    //**************************************************************************************
    componentDidMount()
    {
        //Variables.
        //----------------------
        const { gSystemConfig, SyncSystemNS, FunctionsSyncSystem } = this.context;
        //----------------------


        //Logic.
        //----------------------
        try
        {
            //Check login.
            //TODO: replace with function.
            this.idTbRegistersLoggedCrypt = FunctionsSyncSystem.cookieRead(gSystemConfig.configCookiePrefix + "_" + "idRegisterUser");
            this.idTbRegistersLogged = SyncSystemNS.FunctionsCrypto.decryptValue(SyncSystemNS.FunctionsGeneric.contentMaskRead(this.idTbRegistersLoggedCrypt, "db"), 2);
            if(this.idTbRegistersLogged == "")
            {
                //Redirect.
                this.props.history.push("/" + gSystemConfig.configRouteFrontendLogin +"/?messageAlert=statusMessageLogin1a"); //it may be getting from history cache
                //return (<Redirect to={"/" + gSystemConfig.configRouteFrontendLogin +"/?messageAlert=statusMessageLogin1a"}  />);
            }

            //Show first question.
            FunctionsSyncSystem.htmlGenericStyle01('divQuiz0', 'display', 'block');


            //Main build.
            //await this.build();

            //Head content.
            //await this.headBuild();

            //Title content.
            //await this.titleCurrentBuild();
        }catch(asyncError){
            if(gSystemConfig.configDebug === true)
            {
                console.error(asyncError);
            }
        }finally{

        }
        //----------------------


        //Debug.
        //this.setState({ arrCategoriesListing: this.props.arrCategoriesListing });
        //console.log("this.props=", this.props);
        //console.log("this.idTbRegistersLogged=", this.idTbRegistersLogged);
    }
    //**************************************************************************************



    //Quiz answer handler.
    //**************************************************************************************
    handleQuizAnswer = () =>
    {
        var countQuizAnswersRight = this.state.quizAnswersRight;
        var tblQuizzesID = "";

        //Logic.
        countQuizAnswersRight++;


        this.setState({ quizAnswersRight: countQuizAnswersRight });
        /*this.setState(({ countQuizAnswersRight }) => ({
            countQuizAnswersRight: countQuizAnswersRight + 1
        }));
        */
        /*
        this.setState((prevState) => ({
            countQuizAnswersRight: prevState.countQuizAnswersRight + 1
        }));
        */
        //this.setState(prev => ({ countQuizAnswersRight: prev.countQuizAnswersRight + 1 }));


        /*this.setState(state => {
            const newState = [...state]; //keep state immutable
            !newState[countQuizAnswersRight] && (newState[countQuizAnswersRight] = 0)
            newState[countQuizAnswersRight]++
     
            return newState
         });
         */

        /*this.setState({
            quizAnswersRight: this.state.quizAnswersRight + 1
        })*///working


        //Debug.
        //console.log("quizAnswersRight", this.state.quizAnswersRight);


        //Usage.
        /*
        onClick={() => this.handleQuizAnswer()}
        */
    }
    //**************************************************************************************


    //Quiz result log handler.
    //**************************************************************************************
    //handleQuizResultLog = async (eventData) =>
    handleQuizResultLog = (eventData) =>
    {
        //Variables.
        //----------------------
        const { gSystemConfig, SyncSystemNS, FunctionsSyncSystem } = this.context;

        let countQuizAnswersRight = this.state.quizAnswersRight;
        let quizResultsLog = this.state.quizResultsLog;
        let quizAnswerStatus = false;
        let tblQuizzesID = "";
        let divQuizID = "";
        //----------------------


        //Value definition.
        //----------------------
        tblQuizzesID = eventData._tblQuizzesID;
        divQuizID = eventData._divQuizID;
        //----------------------


        //Logic.
        //Check answer.
        //if(eventData._objQuizDetails.correct_answer == "True")
        if(eventData._objQuizDetails.id_quizzes_options_answer == eventData._eventValue)
        {
            quizAnswerStatus = true;
            countQuizAnswersRight++;
        }else{
            this.quizCheck = false;
        }

        //Insert log in array.
        quizResultsLog.push({
            tblQuizzesID: tblQuizzesID,
            //divQuizID: divQuizID,
            tblQuizzesLogIdQuizzesOptionsAnswer: eventData._eventValue,
            tblQuizzesIdQuizzesOptionsAnswer: eventData._objQuizDetails.id_quizzes_options_answer,
            objQuizDetails: eventData._objQuizDetails,
            quizAnswerStatus: quizAnswerStatus
        });


        //Update state.
        this.setState({ quizAnswersRight: countQuizAnswersRight });
        this.setState({ quizResultsLog: quizResultsLog });


        //Frontend change.
        ////FunctionsSyncSystem.htmlGenericStyle01('divQuiz' + eventData._tblQuizzesID, 'display', 'none');
        //FunctionsSyncSystem.htmlGenericStyle01('divQuiz' + tblQuizzesID, 'display', 'none');
        FunctionsSyncSystem.htmlGenericStyle01('divQuiz' + divQuizID, 'display', 'none');
        //FunctionsSyncSystem.htmlGenericStyle01('divQuiz' + (tblQuizzesID + 1), 'display', 'block');
        FunctionsSyncSystem.htmlGenericStyle01('divQuiz' + (divQuizID + 1), 'display', 'block');
        //if(tblQuizzesID == (this.props.arrQuizzesListing.length - 1))
        if(divQuizID == (this.props.arrQuizzesListing.length - 1))
        {
            //Show results.
            FunctionsSyncSystem.htmlGenericStyle01('divQuizResultsLog', 'display', 'block');
            if(this.quizCheck === false)
            {
                FunctionsSyncSystem.htmlGenericStyle01('divError', 'display', 'block');

                //Delete cookie.
                FunctionsSyncSystem.cookieDelete(gSystemConfig.configCookiePrefix + "_" + "quizCheck", gSystemConfig.configCookieDefaultOptions);
            }else{
                FunctionsSyncSystem.htmlGenericStyle01('divSuccess', 'display', 'block');

                //Set cookie check.
                FunctionsSyncSystem.cookieCreate(gSystemConfig.configCookiePrefix + "_" + "quizCheck", "true",  gSystemConfig.configCookieDefaultOptions);
            }


            //Record log.
            //TODO: Optimize to make only one data send to record the information.
            //TODO: Option to record the answers as is responded.
            (async function(quizResultsLog, idTbRegistersLogged){ //async marks the block
                //Variables.
                let flagQuizzesLogInsert = true;


                //Logic.
                try{ 
                    //for(let countArray = 0; countArray < this.state.quizResultsLog.length; countArray++)
                    for(let countArray = 0; countArray < quizResultsLog.length; countArray++)
                    {
                        //Variables.
                        let fdQuizzesLog = new FormData();
                        let apiURLQuizzesLogOptions;
                        let apiURLQuizzesLog;
                        let apiQuizzesLogResponse;
                        let objQuizzesLogJson;
                        let idTbRegisters = "0";

                        if(idTbRegistersLogged != "")
                        {
                            idTbRegisters = idTbRegistersLogged;
                        }


                        //Build form data.
                        fdQuizzesLog.append("id", "");
                        //fdQuizzesLog.append("id_quizzes", tblQuizzesID);
                        fdQuizzesLog.append("id_quizzes", quizResultsLog[countArray].objQuizDetails.id);
                        fdQuizzesLog.append("id_quizzes_options", quizResultsLog[countArray].tblQuizzesLogIdQuizzesOptionsAnswer);
                        //fdQuizzesLog.append("id_register", "1638");
                        fdQuizzesLog.append("id_register", idTbRegisters);
                        fdQuizzesLog.append("id_quizzes_options_answer", quizResultsLog[countArray].objQuizDetails.id_quizzes_options_answer);
                        fdQuizzesLog.append("date_creation", "");
                        fdQuizzesLog.append("notes", "");
                        fdQuizzesLog.append("apiKey", SyncSystemNS.FunctionsCrypto.encryptValue(SyncSystemNS.FunctionsGeneric.contentMaskWrite(gSystemConfig.configAPIKeySystem, "env"), 2));

                        //Fetch options for post method.
                        apiURLQuizzesLogOptions = {
                            method: "POST",
                            /*
                            headers: { 
                                //"Content-Type": "application/json; charset=utf-8" 
                                "Content-Type": "multipart/form-data"
                            },
                            */
                            /*
                            body: JSON.stringify({ 
                                id: "",
                                id_quizzes: tblQuizzesID,
                                //id_quizzes_options: this.state.quizResultsLog[countArray].tblQuizzesLogIdQuizzesOptionsAnswer,
                                id_quizzes_options: "123",
                                id_register: "1638", //get id from cookie / authentication
                                //id_quizzes_options_answer: this.state.quizResultsLog[countArray].tblQuizzesIdQuizzesOptionsAnswer,
                                id_quizzes_options_answer: "321",
                                date_creation: "",
                                notes: "",
                            })
                            */
                            body: fdQuizzesLog
                        };

                        //API - build URL string.
                        //apiURLQuizzesLog = gSystemConfig.configAPIURL + "/" + gSystemConfig.configRouteAPI + "/" + gSystemConfig.configRouteAPIQuizzes + "/" + gSystemConfig.configRouteAPIActionLog + "/?apiKey=" + SyncSystemNS.FunctionsCrypto.encryptValue(SyncSystemNS.FunctionsGeneric.contentMaskWrite(gSystemConfig.configAPIKeySystem, "env"), 2);
                        apiURLQuizzesLog = gSystemConfig.configAPIURL + "/" + gSystemConfig.configRouteAPI + "/" + gSystemConfig.configRouteAPIQuizzes + "/" + gSystemConfig.configRouteAPIActionLog + "/";
                        
                        //API - fetch data from backend.
                        apiQuizzesLogResponse = await fetch(apiURLQuizzesLog, apiURLQuizzesLogOptions);
                        objQuizzesLogJson = await apiQuizzesLogResponse.json();


                        //Condition.
                        if(objQuizzesLogJson.returnStatus === false)
                        {
                            flagQuizzesLogInsert = false;
                        }


                        //Debug.
                        //console.log("objQuizzesLogJson=", objQuizzesLogJson);
                    }
                }catch(handleQuizResultLogError){
                    if(gSystemConfig.configDebug === true)
                    {
                        console.log("handleQuizResultLogError=", handleQuizResultLogError);
                    }
                }finally{
                    //Check flag / show proceed.
                    if(flagQuizzesLogInsert === true)
                    {
                        //Show proceed button.

                        //Debug.
                        if(gSystemConfig.configDebug === true)
                        {
                            console.log("flagQuizzesLogInsert=", true);
                        }
                    }
                }
            })(this.state.quizResultsLog, this.idTbRegistersLogged);
        }


        //Debug.
        //console.log("quizAnswersRight=", this.state.quizAnswersRight);
        //console.log("this.state.quizResultsLog=", this.state.quizResultsLog);
        //console.log("eventData._eventValue=", eventData._eventValue);
        //console.log("eventData._tblQuizzesID=", eventData._tblQuizzesID);
        //console.log("eventData._objQuizDetails=", eventData._objQuizDetails);


        //Usage.
        //----------------------
        /*
        onClick={() => this.handleQuizResultLog(
                {
                    _eventValue: false, //true | false
                    _tblQuizzesID: quizzesRowKey,
                    _objQuizDetails: quizzesRow
                }
            )}
        */
       //----------------------
    }
    //**************************************************************************************


    //Quiz reset handler.
    //**************************************************************************************
    handleQuizResultReset = () =>
    {
        //Variables.
        const { gSystemConfig, SyncSystemNS, FunctionsSyncSystem } = this.context;

        //Update state.
        this.setState({
            quizAnswersRight: 0,
            quizResultsLog: []
        });

        //Frontend change.
        FunctionsSyncSystem.htmlGenericStyle01('divQuizStart', 'display', 'block');
        FunctionsSyncSystem.htmlGenericStyle01('divQuizResultsLog', 'display', 'none');
    }
    //**************************************************************************************



    //Render.
    //**************************************************************************************
    render()
    //async render()
    {
        //Variables.
        //----------------------
        //const { gSystemConfig, FunctionsGeneric, FunctionsCrypto } = this.context;
        const { gSystemConfig, SyncSystemNS, FunctionsSyncSystem, HTMLReactParser } = this.context;
        var configLayoutType = null;
        var arrQuizzesListing;

        //var contentToString;
        //----------------------


        //Define values.
        //----------------------
        configLayoutType = this.props.configLayoutType;
        arrQuizzesListing = this.props.arrQuizzesListing;
        //arrQuizzesListing = await this.props.arrQuizzesListing;


        //Debug.
        //console.log("configLayoutType(quizzes listing record)=", configLayoutType);
        //console.log("arrQuizzesListing(Quizzes listing record)=", arrQuizzesListing);
        //----------------------


        //div layout (custom).
        //----------------------
        if(configLayoutType == 2)
        {
            if(arrQuizzesListing.length > 0)
            {
                //Output.
                return(
                    <React.Fragment>
                        { arrQuizzesListing.map((quizzesRow, quizzesRowKey) =>{
                            return (
                                <article id={"divQuiz" + quizzesRowKey} key={quizzesRowKey} 
                                    className="ss-frontend-quizzes-listing-container" 
                                    style={{display: "none"}}>

                                    <div className="ss-frontend-quizzes-container ss-frontend-quizzes-listing-text01">
                                        <p className="ss-frontend-quizzes-listing-content-row01">
                                            { HTMLReactParser(SyncSystemNS.FunctionsGeneric.contentMaskRead(quizzesRow.title, "db")) }
                                        </p>
                                    </div>

                                    { /*Options (multiple) - store in DB.*/ }
                                    <div className="ss-frontend-quizzes-listing-content-row01">
                                        { quizzesRow.quizzesOptions.map((quizzesOptionsRow, quizzesOptionsRowKey) =>{
                                            return (
                                                    <div key={quizzesOptionsRowKey} 
                                                        style={{textAlign: "center", marginBottom: "15px"}}>
                                                        <a onClick={() => this.handleQuizResultLog(
                                                                {
                                                                    _eventValue: quizzesOptionsRow.id, //substitute with option id
                                                                    _tblQuizzesID: quizzesRow.id,
                                                                    _divQuizID: quizzesRowKey,
                                                                    _objQuizDetails: quizzesRow
                                                                }
                                                            )}
                                                            className="ss-frontend-btn-base ss-frontend-btn-action-execute"
                                                            title={ HTMLReactParser(SyncSystemNS.FunctionsGeneric.contentMaskRead(quizzesOptionsRow.title, "db")) }>
                                                                { HTMLReactParser(SyncSystemNS.FunctionsGeneric.contentMaskRead(quizzesOptionsRow.title, "db")) }
                                                        </a>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </article>
                            );
                        }) }
                        
                        { /*Results - quiz answers log.*/ }
                        <div id={"divQuizResultsLog"} style={{display: "none", marginTop: "15px"}}>
                            <div>
                                { SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageFrontend.appLabels, "frontendQuizzesAnswersRight") }:&nbsp;
                                { this.state.quizAnswersRight } / { arrQuizzesListing.length }
                            </div>
                            <div>
                                { SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageFrontend.appLabels, "frontendQuizzesAnswersResults") }:
                                
                                {
                                    this.state.quizResultsLog.map((quizResultsLogRow, quizResultsLogKey) =>{
                                        return (
                                            <div key={quizResultsLogKey} 
                                                className={
                                                    //quizResultsLogRow.quizAnswerStatus.toString() == quizResultsLogRow.objQuizDetails.id ?
                                                    quizResultsLogRow.quizAnswerStatus === true ?
                                                    `ss-frontend-correct`
                                                    :
                                                    `ss-frontend-incorrect`
                                                }>
                                                    { /*HTMLReactParser(quizResultsLogRow.objQuizDetails.question)*/ }
                                                    { HTMLReactParser(quizResultsLogRow.objQuizDetails.title) }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div id="divSuccess" className="ss-frontend-success" style={{textAlign: "center", marginBottom: "15px", display: "none", padding: "0px 4px"}}>
                                <FrontendContent key={107} 
                                    idParentContent={ "107" } 
                                    idTbContent={ "" } 
                                    contentType={ "" } 
                                    configLayoutType={ 2 } 
                                    configContentNRecords={ "" } 
                                    configContentSort={ "" }>
                                </FrontendContent>

                                <a href="http://www.google.com" 
                                    target="_blank"
                                    className="ss-frontend-btn-base ss-frontend-btn-action" 
                                    style={{textAlign: "center", marginTop: "15px"}}>
                                    { SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageFrontend.appLabels, "backendButtonStart") }
                                    
                                </a>
                            </div>
                            <div id="divError" className="ss-frontend-error" style={{textAlign: "center", marginBottom: "15px", display: "none"}}>
                                <FrontendContent key={108} 
                                    idParentContent={ "108" } 
                                    idTbContent={ "" } 
                                    contentType={ "" } 
                                    configLayoutType={ 2 } 
                                    configContentNRecords={ "" } 
                                    configContentSort={ "" }>
                                </FrontendContent>

                                <a href={"/" + gSystemConfig.configRouteFrontendLogoff + "/"} 
                                    className="ss-frontend-btn-base ss-frontend-btn-action" 
                                    style={{textAlign: "center", marginTop: "15px"}}>
                                    Logoff
                                </a>
                            </div>
                        </div>
                    </React.Fragment>
                );
            }else{
                //Output - empty.
                return(
                    <div className="ss-frontend-alert">
                        { SyncSystemNS.FunctionsGeneric.appLabelsGet(gSystemConfig.configLanguageFrontend.appLabels, "frontendMessageQuizzesEmpty") }
                    </div>
                );
            }
        }
        //----------------------

    }    
    //**************************************************************************************
}


export default FrontendQuizzesListingRecord;