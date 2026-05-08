/*
    This utility will go through the various json files and report on their statistics:
    - which terms need fixing
    - which terms are duplicated in which files

    Running data script...
    Found 398 terms across 11 files.
    -----------
    Total Unique Terms:  398
    Duplicates Count:  134
    Terms Need Repair:  79

 */

import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fileData = Object.fromEntries(
    readdirSync(__dirname)
        .filter(f => f.endsWith('.json'))
        .filter(f => !f.endsWith('terms_to_fix.json'))
        .map(f => [f, JSON.parse(readFileSync(join(__dirname, f), 'utf8'))])
);
import fixable_terms from "../data/terms_to_fix.json" with {type: "json"};
const all_terms = Object.values(fileData).flat();

const terms_names = [];
const duplicates = [];
const needs_fixing = [];

function hasTerm(term) {
    return !!terms_names.find(u => u.term === term.term);
}

function findTerm(term) {
    return terms_names.find(u => u.term === term.term);
}

function needsFixing(term) {
    return Object.hasOwn(term, "fix") && term["fix"] === true;
}

function checkData() {
    console.log("Running data script...");

    all_terms.forEach(term => {
        if (needsFixing(term)) {
            needs_fixing.push(term);
        } else {
            if (hasTerm(term)) {
                const dup = findTerm(term);
                if(dup.code !== term.code) {
                    console.log(`Same term ${term.term}, different codes: ${term.code} : ${dup.code} `);
                }
                duplicates.push(term);
            } else {
                terms_names.push(term);
            }
        }
    });

    console.log(`Found ${terms_names.length} terms across ${Object.keys(fileData).length} files.`);
    console.log("-----------");

    fixable_terms.forEach(term => {
        const ndx = terms_names.indexOf(term.term);
        if (ndx === -1) {
            console.log("Need to fix term: ", term.term);
        } else {
            duplicates.push(term);
        }
    });

    needs_fixing.forEach(fixable => {
        if (terms_names.find(u => u.term === fixable.term)) {
            console.log("Fixable in main: ", fixable.term);
        }
    })

    console.log("Total Unique Terms: ", terms_names.length);
    console.log("Duplicates Count: ", duplicates.length);
    console.log("Terms Need Repair: ", needs_fixing.length);
    // console.log(needs_fixing);
    // console.log(duplicates);
}

checkData();