// import { Button } from "primereact/button"
// import { adminApi, superUserApi } from "../../apis"
// import PdfViewer from "../PdfViewer"
// import BirisAdminEdit from "./BirisAdminEdit"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"

// const NoDocumentFound = ({ id }: { id: number | string | undefined }) => {
//   return <div>Document ID: {id} cannot be located</div>
// }

// const BirisAdminEditWrapper = ({
//   id,
//   reportTypes,
//   onLoading,
// }: {
//   id: number | string | undefined
//   reportTypes: number[]
//   onLoading: (loading: { src: string; message: string | null }) => void
// }) => {
//   if (id == null) return <NoDocumentFound id={-1} />
//   const [docInfo, setDocInfo] = useState<BirisFileInfo | null>(null)
//   const [showPdf, setShowPdf] = useState(true)
//   const [allowDelete, setAllowDelete] = useState(false)
//   const navigate = useNavigate()

//   useEffect(() => {
//     onLoading({ src: "BirisAdminEdit", message: "Loading document info..." })
//     setDocInfo(null)
//     if (id == null) return
//     const _id = typeof id === "string" ? parseInt(id) : id

//     adminApi.byId({ id: _id }).then(({ data }: ApiResult) => {
//       setDocInfo(data)
//       if (superUserApi.hasUserToken()) {
//         setAllowDelete(true)
//       }
//       // else if (data.createdDate != null) {
//       //   const createdDate = new Date(data.createdDate)
//       //   // @ts-ignore
//       //   setAllowDelete(Date.now() - createdDate < 1000 * 3600 * 24)
//       // }

//       onLoading({ src: "BirisAdminEdit", message: null })
//     })
//   }, [id])

//   const handleUpdateDoc = (field: string, value: string, docId: number) => {
//     onLoading({
//       src: "BirisAdminEdit",
//       message: "Updating BIRIS Document Info",
//     })
//     adminApi
//       .updateDocField({ docId, field, value })
//       .then(({ data }: { data: BirisFileInfo }) => {
//         setDocInfo(data)
//       })
//       .catch((err: any) => {
//         console.log("error updating", err)
//       })
//       .finally(() => {
//         onLoading({
//           src: "BirisAdminEdit",
//           message: null,
//         })
//       })
//   }

//   const handleDeleteDoc = async (docId: number) => {
//     onLoading({
//       src: "BirisAdminEdit",
//       message: "Updating BIRIS Document Info",
//     })

//     try {
//       const { data } = await adminApi.deleteDoc({ id: docId })
//       navigate("/deleteDocConfirm", { state: data })
//     } catch (err) {
//       console.log(err)
//       // @ts-ignore
//       const { data } = err.response
//       setTimeout(() => {
//         window.alert("Error encountering: " + data)
//       }, 100)
//     } finally {
//       onLoading({
//         src: "BirisAdminEdit",
//         message: null,
//       })
//     }
//   }

//   const handleUpdateDocBridge = (
//     oldBrKey: string | null,
//     value: string | null,
//     docId: number,
//   ) => {
//     // don't update the same brkey
//     if (oldBrKey == value) return

//     // don't add if brKey already exists
//     if (oldBrKey == null && docInfo != null && value != null) {
//       const i = docInfo.brKeys.indexOf(value)
//       if (i > -1) return
//     }

//     adminApi
//       .updateDocBridgesField({ docId, oldBrKey, value })
//       .then(({ data }: { data: BirisFileInfo }) => {
//         setDocInfo(data)
//       })
//       .catch((err: ApiError) => {
//         setTimeout(() => {
//           window.alert(
//             "Encounter error when updating document info: " + err.response.data,
//           )
//         }, 100)
//       })
//   }

//   return docInfo != null ? (
//     <div style={{ height: "98%", width: "100%", display: "flex" }}>
//       <div style={{ flex: 1 }}>
//         <div className="flex align-items-center gap-3">
//           <span className="text-2xl font-semibold text-900 my-3">
//             Information
//           </span>
//           <Button
//             text
//             label={showPdf ? "Hide PDF" : "Show PDF"}
//             onClick={() => setShowPdf(!showPdf)}
//           />
//         </div>
//         <BirisAdminEdit
//           key={docInfo.docId}
//           docInfo={docInfo}
//           allowDelete={allowDelete}
//           handleUpdateDoc={handleUpdateDoc}
//           handleUpdateDocBridge={handleUpdateDocBridge}
//           reportTypes={reportTypes}
//           onLoading={onLoading}
//           handleDeleteDoc={handleDeleteDoc}
//         />
//       </div>
//       <div style={{ display: !showPdf ? "none" : "block", flex: 1 }}>
//         <div className="flex align-items-center gap-3">
//           <span className="text-2xl font-semibold text-900 my-3">Preview</span>
//         </div>
//         <PdfViewer
//           key={docInfo.docId}
//           id={docInfo.docId}
//           brKey={docInfo.brKeys[0]}
//           onLoading={onLoading}
//         />
//       </div>
//     </div>
//   ) : (
//     <div>Loading info</div>
//   )
// }

// export default BirisAdminEditWrapper

export const BirisAdminEditWrapper = () => {}
