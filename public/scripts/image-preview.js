const imagePickerElement = document.querySelector(
  "#image-upload-control input"
);
const imagePreviewElement = document.querySelector("#image-upload-control img");

function updateImagePreview() {
  const files = imagePickerElement.files; //Array

  if (!files || files.length === 0) {
    imagePreviewElement.style.display = "none";
    return;
  } //Case -- previously file is picked now user deselected that

  const pickedFile = files[0];

  // Construct url to this file -- it will lives on visitor's computer

  imagePreviewElement.src = URL.createObjectURL(pickedFile); // static method
  imagePreviewElement.style.display = "block";
}

imagePickerElement.addEventListener("change", updateImagePreview);
