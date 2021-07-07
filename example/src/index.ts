import RichSheet from '../../src/index';
(function () {
  const root = document.getElementById('root');
  const richSheet = new RichSheet({
    dom: root
  });
  console.log('asdf');
  richSheet.laod();
})();
