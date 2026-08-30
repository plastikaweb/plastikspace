/// <reference types="cypress" />

// ***********************************************
// Custom Cypress commands for eco-admin.
//
// The generator's placeholder `login` command was removed rather than kept:
// it console.logged its own `password` argument, which CodeQL flags as
// js/clear-text-logging (high), and nothing called it.
//
// The real login command arrives with AP-0 0.7, when the login screen exists.
// When it does, authenticate through the PocketBase API and never log the
// credentials — see REQUIREMENTS §6 on the two flows e2e must cover
// (AMBR-07 member deletion, AORD-03 order transitions).
//
// https://on.cypress.io/custom-commands
// ***********************************************

export {};
