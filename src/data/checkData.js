/*
    This utility will go through the various json files and report on their statistics:
    - which terms need fixing
    - which terms are duplicated in which files

 */

import terms from "../data/terms.json" with {type: "json"};
import other_terms from "../data/terms2.json" with {type: "json"};
import questions from "../data/questions.json" with {type: "json"};
import verbs from "../data/verbs.json" with {type: "json"};
import date_time_terms from "../data/calendar-terms.json" with {type: "json"};
import color_terms from "../data/colors.json" with {type: "json"};
import faire_terms from "../data/faire.json" with {type: "json"};
import fixable_terms from "../data/terms_to_fix.json" with {type: "json"};


function checkData() {
    console.log("Running data script...");
    const all_terms = [...terms, ...other_terms, ...questions, ...verbs, ...date_time_terms, ...color_terms, ...faire_terms, ...fixable_terms];
    const terms_names = [];
    const duplicates = [];
    const needs_fixing = [];

    all_terms.forEach(term => {
        const ndx = terms_names.indexOf(term.term);
        if(!terms_names.includes(term.term)) {
            terms_names.push(term.term);
        } else {
            duplicates.push(term);
        }
        if (Object.hasOwn(term, "fix") && term["fix"] === true) {
            needs_fixing.push(term);
        }
    })
    console.log(terms_names);
    console.log("-----------")
    fixable_terms.forEach(term => {
        console.log(terms_names.indexOf(term.term));
        const ndx = terms_names.indexOf(term.term);
        if(ndx === -1) {
            console.log("Include Term: ", term.term);
        } else {
            duplicates.push(term);
        }

    })

    console.log("Total Unique Terms: ", terms_names.length);
    console.log("Duplicates Count: ", duplicates.length);
    console.log("Terms Need Repair: ", needs_fixing.length);
    // console.log(duplicates);
}

checkData();
