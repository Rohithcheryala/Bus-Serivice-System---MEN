function toggleClassesOf(id, arrOfClasses = ['block', 'hidden']) {
  let elem = document.getElementById(id);
  arrOfClasses.map((clas) => {
    elem.classList.toggle(clas);
  });
}
