import React from "react";

function App() {
  return (
    <>
    <h1>HI</h1>
    </>
  );
}

export default App;



// removing t_bannerimpression from home page US:225950
// let path = `${process.env.PUBLIC_URL}${window.location.pathname}`;
// path = path.split('/');
// const index1 = ele => ele === 'home';
// const homeValue = path.findIndex(index1);

// if (homeValue === -1) {
//   customBannerImpression(type, id, name, index, title, category, ismoq);
// } else {
//   // in case of sambandham home page, for that we have to fire t_bannerimpression event.
//   const sambadhamIndex = ele => ele === 'sambandham';
//   const sambandhamValue = path.findIndex(sambadhamIndex);
//   if (sambandhamValue !== -1) {
//     customBannerImpression(type, id, name, index, title, category, ismoq);
//   }
// }


// window.onscroll = (e) => {
//   if(window.pageYOffset == 0){
//     setShowCompletePage(false)
//   }else{
//     setShowCompletePage(true)
//   }
// }
