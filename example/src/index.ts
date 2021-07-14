import RichSheet from '../../src/index';
(function () {
  const root = document.getElementById('root');
  const richSheet = new RichSheet({
    dom: root
  });
  richSheet.laod();
})();
