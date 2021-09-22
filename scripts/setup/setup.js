
export function setupTraining(oldTraining = null) {
   /* Main component function to create/edit training

      oldTraining - training data object/null
      return - Promise of training object/null
   */

   if (!oldTraining) return Promise.resolve({name: "Training x"})
   else              return Promise.resolve({name: "Training y"})
}