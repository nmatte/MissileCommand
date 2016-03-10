function Util() {

}

Util.prototype.inherits = function (childClass, superClass) {
  function Surrogate(){ }
  Surrogate.prototype = superClass.prototype;

  childClass.prototype = new Surrogate();
  childClass.prototype.constructor = childClass;
};

module.exports = Util;
