export function cleanseFileName(fn: string) {
  if (fn == null) return ""
  return fn.trim().replace(/[\\/:+*%?\'\s\"<>|,&]/g, "_")
}

const months: { [key: string]: string } = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
}

export const convertYYYYMMDD = (dateStr: string | null) => {
  if (dateStr == null) return null

  const dateParts = /^(\d{4})(\d{2})(\d{2})$/.exec(dateStr)
  if (dateParts == null || dateParts.length !== 4) return null
  const dParts = dateParts.slice(1).map((e) => parseInt(e))

  return dParts == null ||
    dParts.length !== 3 ||
    dParts[0] < 1900 ||
    dParts[0] > 2100 ||
    dParts[1] < 1 ||
    dParts[1] > 12 ||
    dParts[2] < 1 ||
    dParts[2] > 31
    ? null
    : new Date(`"${dParts[1]}/${dParts[2]}/${dParts[0]}"`)
}

export const formatDate = (date: string | null) => {
  return date != null ? new Date(date).toISOString().split("T")[0] : ""
}

export const formatOra2Date = (date: string | null) => {
  const p = formatDate(date).split("-")
  if (p == null || p.length !== 3) return ""
  return p[2] + "-" + months[p[1]].toUpperCase() + "-" + p[0].substring(2, 4)
}

export const formatOraDate = (date: string | null) => {
  const p = formatDate(date).split("-")
  if (p == null || p.length !== 3) return ""
  return p[2] + "-" + months[p[1]] + "-" + p[0]
}

const FOLDER_KEY = "_fuhao-biris-admin-folder_"

export const lastSelectedFolder = () => {
  var p = localStorage.getItem(FOLDER_KEY)
  return p == null ? "c:\\" : p
}

export const saveSelectedFolder = (f: string) => {
  localStorage.setItem(FOLDER_KEY, f)
}

export const isDateObj = (obj: any) =>
  Object.prototype.toString.call(obj) === "[object Date]" && !isNaN(obj)

export const isBrmGuid = (str: string) => {
  return /^[0-9a-fA-F]{32}$/.test(str)
}

export const serialize = (obj, prefix = null) => {
  var str = [],
    p,
    v
  for (p in obj) {
    v = obj[p]
    if (
      v != null &&
      obj.hasOwnProperty(p) &&
      typeof v !== "function" &&
      !(Array.isArray(v) && v.length === 0)
    )
    {
      var k = prefix ? prefix : p
      str.push(
        typeof v === "object"
          ? serialize(v, k)
          : encodeURIComponent(k) + "=" + encodeURIComponent(v)
            // k + "=" + v)
      )
    }
  }
  return str.join("&")
}