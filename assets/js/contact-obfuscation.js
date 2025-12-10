document.addEventListener("DOMContentLoaded", function () {

  /* --------------------------
     PHONE NUMBER OBFUSCATION
     -------------------------- */

  // Break number into pieces to avoid easy pattern matching
  const p1 = "+1 (56";
  const p2 = "1) 247";
  const p3 = "-14";
  const p4 = "30";

  const displayPhone = p1 + p2 + p3 + p4; // +1 (561) 247-1430
  const telPhone = "+15612471430";

  const phoneLink = document.getElementById("phone-link");
  if (phoneLink) {
    phoneLink.textContent = displayPhone;
    phoneLink.href = "tel:" + telPhone;
  }

  /* --------------------------
     EMAIL OBFUSCATION
     -------------------------- */

  // Also split the email into harmless pieces
  const e1 = "hels";
  const e2 = "harif";
  const e3 = "@gm";
  const e4 = "ail";
  const e5 = ".c";
  const e6 = "om";

  const fullEmail = e1 + e2 + e3 + e4 + e5 + e6;

  const emailLink = document.getElementById("email-link");
  if (emailLink) {
    emailLink.textContent = fullEmail;
    emailLink.href = "mailto:" + fullEmail;
  }

});
