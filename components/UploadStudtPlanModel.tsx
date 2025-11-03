'use client'

import { Dialog, DialogPanel, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment, useState } from 'react'

// Props for closing modal
type UploadStudtPlanModelProps = {
  onClose: () => void;
};

export default function UploadStudtPlanModel({ onClose }: UploadStudtPlanModelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  // 🔹 Handle modal close
  function close() {
    setIsOpen(false)
    onClose()
  }

  // 🔹 Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ✅ Restrict type to JPEG/PNG only
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setUploadMessage('❌ Please upload a JPEG or PNG image only.')
      return
    }

    // ✅ Restrict file size (max 25 MB)
    if (file.size > 25 * 1024 * 1024) {
      setUploadMessage('❌ File is too large. Max size: 25 MB.')
      return
    }

    setSelectedFile(file)
    setUploadMessage(`📄 Selected: ${file.name}`)
  }

  // 🔹 Handle upload to n8n webhook
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('⚠️ Please select an image first.')
      return
    }

    setUploading(true)
    setUploadMessage('⏳ Uploading your study plan...')

    try {
      // Prepare file for upload
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('source', 'upload-modal')

      // 🚀 Send file to your n8n webhook
      const response = await fetch('http://144.91.68.16:5678/webhook-test/chatbox-upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setUploadMessage('✅ Uploaded successfully! Your study plan is being analyzed.')
        setSelectedFile(null)
      } else {
        const errText = await response.text()
        setUploadMessage(`❌ Upload failed: ${errText}`)
      }
    } catch (error) {
      console.error(error)
      setUploadMessage('❌ An error occurred while uploading. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
        {/* Overlay fade transition */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/10" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-[663px] rounded-xl shadow-xxl bg-white p-6 backdrop-blur-2xl">
              <h2 className="text-lg font-sora text-black2 font-semibold">Upload Study plan</h2>
              <p className="text-sm text-gray3">
                Please upload your study plan from edugate as a screenshot
              </p>

              {/* Upload area */}
              <div className="w-full mt-3 relative">
                <div className="relative inline-flex items-center justify-center w-full border-[1.5px] rounded-lg border-dashed border-green1">
                  <label
                    htmlFor="file"
                    className="py-[108px] cursor-pointer rounded-lg w-full lg:px-[178px] inline-flex items-center justify-center"
                    style={{
                      background:
                        'linear-gradient(302deg, var(--color-blue2), var(--color-green2))',
                      opacity: 0.3,
                    }}
                  >
                    <input
                      type="file"
                      name="file"
                      id="file"
                      hidden
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                    />
                  </label>

                  <div className="absolute pointer-events-none text-center flex flex-col items-center justify-center">
                    <Image
                      src="/icons/upload-gradient-icon.svg"
                      width={32}
                      height={32}
                      alt="upload"
                    />
                    <h4 className="text-black2 text-base font-medium text-center font-dm_sans">
                      Drop file or browse
                    </h4>
                    <p className="text-gray3 text-sm font-dm_sans">
                      Format: .jpeg, .png & Max file size: 25 MB
                    </p>
                  </div>
                </div>

                {uploadMessage && (
                  <p className="text-sm text-center mt-3 text-gray-700">{uploadMessage}</p>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  disabled={uploading}
                  onClick={handleUpload}
                  style={{
                    background:
                      'linear-gradient(302deg, var(--color-blue2), var(--color-green2))',
                  }}
                  className="inline-flex text-center cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2.5 text-base font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Done'}
                </button>

                <button
                  className="inline-flex cursor-pointer border border-gray4 text-center items-center justify-center gap-2 rounded-md bg-white px-3 py-2.5 h-11 text-base font-semibold text-black3 shadow shadow-gray3/5"
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}