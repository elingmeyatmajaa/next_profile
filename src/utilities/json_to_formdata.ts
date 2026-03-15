export default function jsonToFormData(json: any, prefix = ""): FormData {
  const formData = new FormData();
  console.log('halo', formData)
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];

      if (Array.isArray(value)) {
        // Jika value adalah array
        value.forEach((item, index) => {
          for (const subKey in item) {
            if (item?.hasOwnProperty(subKey)) {
              formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
            }
          }
        });
      } else {
        //jika value adalah object
        if (typeof value === "object") {
          if (value?.hasOwnProperty('path')) {
            formData.append(key, value, value['path']);
          } else {
            for (const subKey in value) {
              if (value.hasOwnProperty(subKey)) {
                formData.append(`${key}[${subKey}]`, value[subKey]);
              }
            }
          }
          continue;
        } else {
          formData.append(key, value);
        }
        // Nilai biasa
      }
    }
  }

  return formData;
}

// export default function jsonToFormData(json: any): FormData {
//   const formData = new FormData();

//   for (const key in json) {
//     if (json.hasOwnProperty(key)) {
//       const value = json[key];

//       if (Array.isArray(value)) {
//         // Jika value adalah array
//         value.forEach((item, index) => {
//           for (const subKey in item) {
//             if (item.hasOwnProperty(subKey)) {
//               formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
//             }
//           }
//         });
//       } else {
//         // Nilai biasa
//         formData.append(key, value);
//       }
//     }
//   }

//   return formData;
// }
