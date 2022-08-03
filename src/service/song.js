import { get } from "./base"

export function processSongs(songs){
    if(!songs.length){
        return Promise.resolve(songs)
    }
    return get('/api/getSongsUrl',{
        mid:songs.map((songs)=>{
            return songs.mid
        })
    }).then((result)=>{
        const map = result.map
        return songs.map((song)=>{
            song.url = map[song.mid]
            return song
        }).filter((song)=>{
            return song.url.indexOf('vkey') > -1
        })
    })
}

// 获取歌词
const lyricMap ={}//
// song可能是不同的对象 但是他的mid是相等的，在外部定义一个lyricMap
// key是ID， 值是lyric 获取到歌词后，给lyricMap做一个保留，
// 然后可以根据lyricMap对应的mid，拿到lyric
// 如果能拿到lyric也说明请求过了，就直接return
export function getLyric(song){
    if(song.lyric){
        return Promise.resolve(song.lyric)
    }
    const mid = song.mid
    
    const lyric = lyricMap[mid]//
    if(lyric){//
        return Promise.resolve(lyric)//
    }//

    
    return get('/api/getLyric',{
        mid
    }).then((result)=>{
        const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
        lyricMap[mid] = lyric//
        return lyric
    })
}