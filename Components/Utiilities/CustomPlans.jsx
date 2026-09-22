import React from "react";
import CryptoJS from "crypto-js";
import "./CustomPlans.css";
import { MyContext } from "../../App";
import { RequestLicense } from "./RequestLicense";
import { RequestLicenseEnterprise } from "./RequestLicenseEnterprise";

const CustomPlans = ({ AppName = "Expense 365" }) => {
  const [isFromIndia, setIsFromIndia] = React.useState(false);
  const SiteName = React.useContext(MyContext);

  const tokenCount = [
    "25241198af9c52",
    "843b85132fe7ea",
    "6a981cfd695563",
    "1840068c4be068",
  ];

  async function getIpInfo() {
    for (const token of tokenCount) {
      try {
        const response = await fetch(`https://ipinfo.io/json?token=${token}`);
        if (!response.ok) continue;
        const data = await response.json();
        if (data && !data.error && data.status !== 429) {
          const fromIndia = data.country === "IN";
          localStorage.setItem("ipInfo", JSON.stringify(data));
          return fromIndia;
        }
      } catch (error) {}
    }
    return false;
  }

  function parseAndCombinePlans(data) {
    return [
      { title: "Standard", ...JSON.parse(data.P1Plans || "{}") },
      { title: "Plus", ...JSON.parse(data.P2Plans || "{}") },
      { title: "Premium", ...JSON.parse(data.P3Plans || "{}") },
      { title: "Enterprise", ...JSON.parse(data.P4Plans || "{}") },
    ];
  }

  function formatDynamicFeatureText(feature, plan, indiaUser) {
    if (!indiaUser) return feature;

    const addOn = plan?.AddOns?.[0];
    const hasINRAddon = addOn && (addOn.monthlyINR || addOn.priceINR);
    if (!hasINRAddon) return feature;

    const monthlyINR = addOn.monthlyINR || (addOn.priceINR ? Math.round(addOn.priceINR / 12) : null);
    const usersCount = addOn.noOfUsers ? parseInt(addOn.noOfUsers) : 10;
    const perUserMonthly = monthlyINR ? Math.round(monthlyINR / usersCount) : null;

    let updated = feature;
    if (perUserMonthly) {
      updated = updated.replace(
        /(?:Additional users at|Add-on)\s+\$\d+(?:\.\d+)?\/user/gi,
        `Additional users at ₹${perUserMonthly.toLocaleString("en-IN")}/user`
      );
    }
    return updated;
  }

  async function getData(indiaUser) {
    const showPriceFor = "Standard";
    try {
      let plans = null;

      // 1. Primary Endpoint
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        const cacheBuster = Date.now();

        const response = await fetch(
          `https://www.apps365.com/wp-json/external-api/v1/products?t=${cacheBuster}`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);

        if (response.ok) {
          const item = await response.json();
          const list = item?.data?.value || item?.value || [];
          plans = list.find(
            (c) =>
              c.ProductName &&
              c.ProductName.trim().toLowerCase().includes("expense")
          );
        }
      } catch (err) {}

      // 2. Secondary Fallback Trigger
      if (!plans) {
        try {
          const fallbackUrl =
            "https://defaultdb23acafbe244d519d6e5a51626269.7c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/b562b2e400d448a0ada797c66e8c223c/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bBdjf8dkuY4Nu44uv3l-HEYjt26o8TQUCRpJ8uuL2FU";

          const fallbackResponse = await fetch(fallbackUrl, { method: "GET" });
          if (fallbackResponse.ok) {
            const fallbackItem = await fallbackResponse.json();
            const list = fallbackItem?.d?.results || fallbackItem?.data?.value || [];
            plans = list.find(
              (c) =>
                c.ProductName &&
                c.ProductName.trim().toLowerCase().includes("expense")
            );
          }
        } catch (fallbackError) {}
      }

      const container = document.getElementById("pricing-widget-container");

      if (!plans) {
        if (container) {
          container.innerHTML = `<div style="text-align:center; padding: 20px;">No pricing data found for Expense 365.</div>`;
        }
        return;
      }

      let UserBased = "No";
      let LiteUserBased = "No";
      let PromoPlan = "Yes";

      if (plans?.Data) {
        try {
          const d = JSON.parse(plans.Data);
          UserBased = d?.UserBased || "No";
          LiteUserBased = d?.LiteUser || "No";
          PromoPlan = d?.PromoPlan || "Yes";
        } catch (e) {}
      }

      // Filter out Standard plan for Expense 365
      const parsedData = parseAndCombinePlans(plans).filter((plan) => plan.title !== "Standard");

      const validData = parsedData.filter(
        (item) =>
          (item.price !== undefined &&
            item.subPrice !== undefined &&
            item.TotalPrice !== undefined &&
            Array.isArray(item.plans) &&
            item.plans.length > 0 &&
            item.plans.some((plan) => plan && plan.trim() !== "")) ||
          item.isContactus === "Yes"
      );

      if (!container) return;
      container.innerHTML = "";

      container.innerHTML = `
        <div class="pricing-widget-container">
          ${validData
            ?.map((plan, index) => {
              const isContactus = plan.isContactus === "Yes";
              const isFree = plan.price == 0;
              const isPromoPrice = plan.isPromoPrice === "Yes";
              const showINR = indiaUser && Boolean(plan.priceINR);
              const displayINRPrice = Number(plan.priceINR).toLocaleString("en-IN");

              return `
                <div class="plan-card ${
                  validData?.some((x) => x.isPromoPrice === "Yes") && PromoPlan === "Yes"
                    ? " bigPadding MRPCardStyles"
                    : " smallPadding"
                } 
                ${plan.MRPprice && PromoPlan === "Yes" ? " paddingStylesOfCard" : ""}
                ${
                  index === validData.length - 1 &&
                  plan.MRPprice &&
                  PromoPlan === "Yes" &&
                  isPromoPrice
                    ? " EnterPriseCard"
                    : index === validData.length - 1
                    ? "featured"
                    : ""
                }">
                  
                  ${
                    plan.SpecialOfferText && PromoPlan === "Yes" && isPromoPrice
                      ? `<div class="save-badge"><span class="Promo-Offtext">${plan.SpecialOfferText}</span><i class="LimitedOffer"> Limited time offer*</i></div>`
                      : ""
                  }
                  
                  <h4 class="plan-title">${plan.title}</h4>

                  <div class="${
                    plan.MRPprice && PromoPlan === "Yes" && isPromoPrice
                      ? "FlexStyles"
                      : "plan-price"
                  }">
                    ${
                      isContactus
                        ? `<div class="customPricetext">${plan.ContactusDescription || "Contact Us"}</div>`
                        : isFree
                        ? `<div>Free</div>`
                        : plan.MRPprice && PromoPlan === "Yes" && isPromoPrice
                        ? showINR
                          ? `
                            <div class="ActualPriceandPlanPrice">
                              <div class="ActualPrice">
                                &#8377;${
                                  plan.MRPpriceINR
                                    ? Number(plan.MRPpriceINR).toLocaleString("en-IN")
                                    : Number(plan.actualPriceINR || plan.priceINR).toLocaleString("en-IN")
                                } 
                                <div class="SubPriceUI">${plan.MRPsubPriceINR ?? plan.actualSubPriceINR ?? plan.subPriceINR ?? ""}</div>
                                <span class="Borderline"></span>
                              </div>
                              <div class="PremiumPriceStyles">
                                &#8377;${Number(plan.promoPriceINR ?? plan.priceINR).toLocaleString("en-IN")} 
                                <div class="SubPriceUI">${plan.promoSubPriceINR ?? plan.subPriceINR ?? ""}</div>
                              </div>
                            </div>
                          `
                          : `
                            <div class="ActualPriceandPlanPrice">
                              <div class="ActualPrice">
                                $${plan.MRPprice} 
                                <div class="SubPriceUI">${plan.MRPsubPrice ?? ""}</div>
                                <span class="Borderline"></span>
                              </div>
                              <div class="PremiumPriceStyles">
                                $${plan.price} 
                                <div class="SubPriceUI">${plan.subPrice ?? ""}</div>
                              </div>
                            </div>
                          `
                        : showINR
                        ? `
                          <div class="rupee-price-wrapper">
                            <span class="rupee-price-icon">&#8377;</span>
                            <span class="rupee-price">${displayINRPrice}</span>
                          </div>
                          <div class="SubPriceUI">${plan.subPriceINR ?? ""}</div>
                        `
                        : `
                          <div>$${plan.price}</div>
                          <div class="SubPriceUI">${plan.subPrice ?? ""}</div>
                        `
                    }
                  </div>

                  ${
                    !isContactus
                      ? `<p class="billing-info" style="visibility:${
                          isFree || isContactus ? "hidden" : "visible"
                        };">
                          per month, billed yearly
                        </p>`
                      : ""
                  }

                  ${
                    plan.SpecialDescription &&
                    plan.MRPprice &&
                    PromoPlan === "Yes" &&
                    isPromoPrice
                      ? `<p class="special-description">${plan.SpecialDescription}</p>`
                      : ""
                  }

                  <h3 class="plan-features-title">
                    ${
                      index > 0
                        ? "Everything in " + validData[index - 1].title + " and..."
                        : (validData?.[index]?.title || "") + " Plan Features"
                    }
                  </h3>

                  <ul class="plan-features">
                    ${plan.plans
                      ?.map((feature) => {
                        const displayFeature = formatDynamicFeatureText(feature, plan, indiaUser);
                        return displayFeature
                          ? `<li>
                              <span class="tick-icon">
                                <div class="checkIconandFeature">
                                  <span class="checkmarkicon">&#10003;</span>
                                </div>
                              </span>
                              <span class="helpdesktoolTipStyles">${displayFeature}</span>
                            </li>`
                          : "";
                      })
                      .join("")}
                  </ul>

                  <div class="custom-elementor-shortcode">
                    <button class="buy-price ${
                      index === validData.length - 1 &&
                      (!plan.MRPprice || PromoPlan !== "Yes" || !isPromoPrice)
                        ? "CustomAddToCartEnterprise"
                        : "CustomAddToCart"
                    }"
                      id="${
                        isContactus
                          ? "RequestLicenseEnterprise"
                          : isFree || showPriceFor.includes(plan.title)
                          ? "openCustomPricePopup"
                          : `std${index + 1}`
                      }"
                      data-ids="${3154 + index}">
                      <a href="#!" id="std${index + 1}1">
                        ${
                          isContactus || isFree || showPriceFor.includes(plan.title)
                            ? "Request License"
                            : "Add To Cart"
                        }
                      </a>
                    </button>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;

      const requestBtn = document.getElementById("openCustomPricePopup");
      if (requestBtn) {
        requestBtn.onclick = (e) => {
          e.preventDefault();
          handleOpenpopup();
        };
      }

      const enterpriseBtn = document.getElementById("RequestLicenseEnterprise");
      if (enterpriseBtn) {
        enterpriseBtn.onclick = (e) => {
          e.preventDefault();
          handleOpenEnterPrisepopup();
        };
      }

      validData.forEach((plan, index) => {
        const addToCartButton = document.getElementById(`std${index + 1}`);
        if (addToCartButton) {
          addToCartButton.onclick = () => getTxID(plan, LiteUserBased, indiaUser);
        }
      });
    } catch (err) {
      console.error("Error in getData:", err);
    }
  }

  function decryptFromBase64Url(encryptedText) {
    let secretKey = "Super@Salt";
    let base64 = encryptedText.replace(/-/g, "+").replace(/_/g, "/");
    let decrypted = CryptoJS.AES.decrypt(atob(base64), secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  function encryptToBase64Url(text) {
    let secretKey = "Super@Salt";
    let encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
    let base64 = btoa(encrypted);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function createProductItem(img, name, description, price, isINRItem = false) {
    return {
      price: {
        description: description || "",
        billing_cycle: {
          frequency: 1,
          interval: "year",
        },
        tax_mode: "external",
        unit_price: {
          amount: (Number(price) * 100).toString(),
          currency_code: isINRItem ? "INR" : "USD",
        },
        custom_data: {
          selectedYear: "1 year",
        },
        product: {
          name: name || "",
          image_url: img || "",
          tax_category: "saas",
        },
      },
      quantity: 1,
    };
  }

  function isStringValidated(value) {
    return typeof value === "string" && value !== null && value !== undefined && value !== "";
  }

  function filterUniqueProducts(cartItems) {
    const uniqueProducts = [];
    const seenDescriptions = new Set();

    cartItems?.forEach((item) => {
      const description = item.price.description;
      if (!seenDescriptions.has(description)) {
        uniqueProducts.push(item);
        seenDescriptions.add(description);
      }
    });

    return uniqueProducts;
  }

  function handleOpenpopup() {
    const popup = document.getElementById("customPricePopup");
    if (popup) popup.style.display = "flex";
  }

  function handleOpenEnterPrisepopup() {
    const popup = document.getElementById("customEnterPrisePopup");
    if (popup) popup.style.display = "flex";
  }

  function handleClosepopup() {
    const popup = document.getElementById("customPricePopup");
    if (popup) popup.style.display = "none";
    const enterprisePopup = document.getElementById("customEnterPrisePopup");
    if (enterprisePopup) enterprisePopup.style.display = "none";
  }

  async function getTxID(plan, LiteUserBased, indiaUser) {
    const useINR = indiaUser && Boolean(plan?.TotalPriceINR || plan?.priceINR);
    const mainPrice = useINR ? (plan.TotalPriceINR || plan.priceINR) : plan?.TotalPrice;

    let staticbody = {
      items:
        isStringValidated(plan?.AddOns?.[0]?.name) &&
        plan?.AddOns?.[0]?.price &&
        plan?.AddOns?.[0]?.price != 0
          ? [
              createProductItem(
                plan?.ProductImage,
                plan?.ProductTitle,
                plan?.ProductDescription,
                mainPrice,
                useINR
              ),
              ...plan?.AddOns?.map((addOn) =>
                createProductItem(
                  plan?.ProductImage,
                  addOn?.name,
                  addOn?.description,
                  useINR && addOn?.priceINR ? addOn.priceINR : addOn?.price,
                  useINR
                )
              ),
            ]
          : [
              createProductItem(
                plan?.ProductImage,
                plan?.ProductTitle,
                plan?.ProductDescription,
                mainPrice,
                useINR
              ),
            ],
    };

    let Existingcart = localStorage.getItem("storedUpdatedAppURL")
      ? JSON.parse(decryptFromBase64Url(localStorage.getItem("storedUpdatedAppURL")))
      : [];
    let currency_code = useINR ? "INR" : Existingcart?.currency_code || "USD";
    let currency_symbol = useINR ? "₹" : Existingcart?.currency_symbol || "$";
    let userInfo = Existingcart ? Existingcart?.userInfo || {} : {};

    let NewCurrentItems = staticbody?.items || [];
    let finalCartItems = Existingcart?.items
      ? Existingcart.items.concat(NewCurrentItems)
      : NewCurrentItems;

    const uniqueCartItems = filterUniqueProducts(finalCartItems);
    let URL = JSON.stringify({
      items: uniqueCartItems,
      currency_code: currency_code,
      currency_symbol: currency_symbol,
      userInfo: userInfo,
    });

    let nextpageURL = encryptToBase64Url(URL);
    localStorage.setItem("storedUpdatedAppURL", nextpageURL);
    localStorage.setItem("storedActualAppURL", nextpageURL);

    // Dynamic checkout domain routing based on SiteName context
    let siteurl = "";
    if (SiteName === "HR365") {
      siteurl = "https://www.hr365.us/checkout/";
    } else {
      siteurl = "https://www.apps365.com/checkout/";
    }

    const urlToStore = `${siteurl}?producturl=${nextpageURL}`;
    window.open(urlToStore, "_self");
  }

  React.useEffect(() => {
    let detectedIndia = false;
    const cachedIpInfo = localStorage.getItem("ipInfo");

    if (cachedIpInfo) {
      try {
        const parsed = JSON.parse(cachedIpInfo);
        detectedIndia = parsed?.country === "IN";
      } catch (e) {}
    }

    setIsFromIndia(detectedIndia);
    getData(detectedIndia);

    getIpInfo().then((liveIndia) => {
      if (liveIndia !== detectedIndia) {
        setIsFromIndia(liveIndia);
        getData(liveIndia);
      }
    });

    // Theme branding colors for expense365.ai
    const textvarcolor = "#dd1077";
    const bgmainvarcolor = "#f31c88";
    const bgsecondvarcolor = "#c10161";
    const darkbtnvarcolor = "#2323ce";
    const topborder = "2.3vw";
    const btnBgColor = "linear-gradient(135deg, #1285f5 24%, #2323ce 80%)";

    document.documentElement.style.setProperty("--text-color", textvarcolor);
    document.documentElement.style.setProperty("--bg-main-color", bgmainvarcolor);
    document.documentElement.style.setProperty("--bg-second-color", bgsecondvarcolor);
    document.documentElement.style.setProperty("--dark-button-color", darkbtnvarcolor);
    document.documentElement.style.setProperty("--button-bg-color", btnBgColor);
    document.documentElement.style.setProperty("--top-for-line", topborder);
  }, [SiteName]);

  return (
    <>
      <div id="pricing-widget-container" data-plan-type="Expense 365">
        <div className="loader-wrapper">
          <div className="loader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="loading-text">Loading Expense 365 Plans...</div>
        </div>
      </div>

      <div id="customPricePopup" style={{ display: "none" }} className="popup-overlay">
        <RequestLicense handleClosepopup={handleClosepopup} />
      </div>

      <div
        id="customEnterPrisePopup"
        style={{ display: "none" }}
        className="popup-overlay"
      >
        <RequestLicenseEnterprise handleClosepopup={handleClosepopup} />
      </div>
    </>
  );
};

export default CustomPlans;