export function getRouteParam(props, param, integer = true) {
  if (props && props.match && props.match.params && props.match.params[param]) {
    return integer ? (parseInt(props.match.params[param], 10) || undefined) : props.match.params[param];
  }

  return undefined;
}
