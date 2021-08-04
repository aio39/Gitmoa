import { useState } from 'react'

type TagModalProps = {
  tagList: string[]
  setTagList(input: any): void
}

export default function TagModal({ tagList, setTagList }: TagModalProps) {
  const loadedTagList = [
    { name: 'javasciprt1', link: '/icon/javascript.png', selected: false },
    { name: 'javasciprt2', link: '/icon/javascript.png', selected: false },
    { name: 'javasciprt3', link: '/icon/javascript.png', selected: false },
    { name: 'javasciprt4', link: '/icon/javascript.png', selected: false },
    { name: 'javasciprt6a', link: '/icon/javascript.png', selected: false },
    { name: 'javasciprt1a', link: '/icon/javascript.png', selected: false },
    { name: 'javasciprt2a', link: '/icon/javascript.png', selected: false },
    { name: 'javasciprt3a', link: '/icon/javascript.png', selected: false },
    { name: 'javasciprt4a', link: '/icon/javascript.png', selected: false },
    { name: 'javasciprt5a', link: '/icon/javascript.png', selected: false },
  ]
  const [savedTagList, setSavedTagList] = useState(loadedTagList)

  const tagSelectHandler = (e) => {
    const { tagName, tagIdx } = e.currentTarget.dataset

    if (tagList.length >= 5 && !savedTagList[tagIdx].selected) return

    setSavedTagList((prev) => {
      const newList = [...prev]
      newList[tagIdx].selected = !newList[tagIdx].selected
      return newList
    })
    tagList.includes(tagName)
      ? setTagList((prev) => prev.filter((tag) => tag !== tagName))
      : setTagList((prev) => [...prev, tagName])
  }
  console.log(tagList)

  return (
    <div className="absolute bg-gray-800 w-3/4 max-w-4xl h-auto max-h-64 overflow-y-scroll p-4">
      <h1 className="text-white text-2xl mb-2">tag</h1>
      <div className="flex flex-wrap justify-between">
        {savedTagList.map((tag, idx) => (
          <div
            key={tag.name}
            data-tag-name={tag.name}
            data-tag-idx={idx}
            onClick={tagSelectHandler}
            className="flex flex-col justify-center  opacity "
          >
            <img
              src={tag.link}
              alt={tag.name}
              className={`w-20 h-20 m-auto ${tag.selected && 'opacity-70'}`}
            />
            <div className={`${tag.selected ? 'text-gray-600' : 'text-white'}`}>
              {tag.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
