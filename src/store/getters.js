import templates from './models/templates'
import aspectRating from './models/aspectRating'
import overallRating from './models/overallRating'
import overalRatingQualifier from './models/overalRatingQualifier'

const randomFromList = (list) => {
  return list[Math.floor(Math.random() * list.length)]
}

const extractFromAspectRatingIndex = (aspectRatingObj) => {
  let tag = aspectRatingObj.tag
  let rate = aspectRatingObj.rate
  let why = aspectRatingObj.why
  if (tag !== '' || why !== '' || rate !== '') {
    let text = aspectRating[tag][rate]
    return {
      text: text,
      why: why
    }
  }
}

export default {
  aboutAd: state => state.aboutAd,
  aspects: state => state.aspects,
  overallRating: state => state.overallRating,
  currentAspect: state => {
    return state.aspectRating.map(el => (el.tag + el.rate))
  },
  aspectRatingWhys: state => {
    return query => {
      return state.aspectRatingWhys.filter(el => el.pt.includes(query))
    }
  },
  currentWhy: state => {
    return state.aspectRating.map(el => el.why)
  },
  nthAspectSelectArray: (state) => {
    return index => {
      let aspect = state.aspectRating[index]
      return [aspect.tag]
    }
  },
  extractFromFirstAspect: (state) => {
    return extractFromAspectRatingIndex(state.aspectRating[0])
  },
  extractFromSecondAspect: (state) => {
    return extractFromAspectRatingIndex(state.aspectRating[1])
  },
  overallRatingText: (state) => {
    return state.overallRating ? randomFromList(overallRating[state.overallRating]) : ''
  },
  overallRatingTextQualifier: (state) => {
    return state.overallRating ? randomFromList(overalRatingQualifier[state.overallRating]) : ''
  },
  placeholders: (state, getters) => {
    return {
      '{{aboutAd}}': getters.aboutAd,
      '{{firstAspectText}}': getters.extractFromFirstAspect ? getters.extractFromFirstAspect.text : '',
      '{{firstAspectWhy}}': getters.extractFromFirstAspect ? getters.extractFromFirstAspect.why : '',
      '{{secondAspectText}}': getters.extractFromSecondAspect ? getters.extractFromSecondAspect.text : '',
      '{{secondAspectWhy}}': getters.extractFromSecondAspect ? getters.extractFromSecondAspect.why : '',
      '{{overallRatingText}}': getters.overallRatingText,
      '{{overallRatingTextQualifier}}': getters.overallRatingTextQualifier
    }
  },
  generatedComment: (state, getters) => {
    if (getters.validated) {
      return randomFromList(templates).replace(/{{\w+}}/g, all => {
        return getters.placeholders[all] || all
      })
    }
  },
  validated: (state, getters) => {
    return getters.isAspectRatingEmpty
  },
  isAspectRatingEmpty: (state) => {
    let firstAspect = state.aspectRating[0]
    if (firstAspect.tag === '' || firstAspect.why === '' || firstAspect.rate === '') {
      return false
    }

    let secondAspect = state.aspectRating[1]
    if (secondAspect.tag === '' || secondAspect.why === '' || secondAspect.rate === '') {
      return false
    }

    return true
  }
}
