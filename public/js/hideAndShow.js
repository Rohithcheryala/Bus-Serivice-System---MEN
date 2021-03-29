function show(id, disp = 'block') {
  let elem = document.getElementById(id);
  if ([...elem.classList].includes('hidden')) {
    elem.classList.remove('hidden');
    elem.classList.add(disp);
  }
}

function hide(id) {
  let elem = document.getElementById(id);
  if ([...elem.classList].includes('block')) {
    elem.classList.remove('block');
    elem.classList.add('hidden');
  } else if ([...elem.classList].includes('inline')) {
    elem.classList.remove('inline');
    elem.classList.add('hidden');
  }
}
