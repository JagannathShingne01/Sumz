import { useState, useEffect } from "react"
import { copy, linkIcon, loader, tick, deleteicon } from "../assets"
import { useLazyGetSummaryQuery } from '../services/articleSlice'


const Demo = () => {
  const [article, setArticle] = useState({
    url:'',
    summary: '',
  })

  const [allArticles, setAllArticles] = useState([])
  const [copyied, setCopy] = useState("")
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery()

  useEffect(()=>{
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    )

    if(articlesFromLocalStorage){
      setAllArticles(articlesFromLocalStorage)
    }

  },[])
  const handleSubmit = async(e)=>{
    e.preventDefault();
      const { data } = await getSummary({ articleUrl: article.url}) 
      if (data?.summary) {
        const newArticle = {...article, summary: data.summary}

        const updatedAllArticles = [newArticle, ...allArticles]

        setArticle(newArticle);
        setAllArticles(updatedAllArticles);

        localStorage.setItem('articles', JSON.stringify(updatedAllArticles))
      }
  }

  const handleDelete = (url)=>{
    const updatedArticle = allArticles.filter((article)=> article.url != url);
    setAllArticles(updatedArticle)
    localStorage.setItem('articles', JSON.stringify(updatedAllArticles))
  }
  const handleCopy = ( copyUrl )=>{
    setCopy(copyUrl)
    navigator.clipboard.writeText(copyUrl)
    setTimeout(() => setCopy(false), 3000);
  }

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form action="" className="relative flex-col justify-center items-center " onSubmit={handleSubmit}>
          <img src={linkIcon} alt="Icon" className="absolute left-0 my-2 ml-3 w-5" />
          <input type="url" 
                 placeholder="Enter a URL"
                 value={article.url}
                 onChange={(e)=> setArticle({
                  ...article,
                  url: e.target.value
                 })}
                 required
                 className="url_input peer"
                 />
                 <button onClick={handleSubmit} className="submit_btn peer-focus:border-gray-700 hover:bg-amber-300 peer-focus:text-gray-700">Submit</button>

                 <div className="flex flex-col gap-1 max-h-60 overscroll-y-auto">
                  {
                    allArticles.map((item, index)=>(
                      <>
                      <div key={index}
                      className="link_card"
                      onClick={()=> setArticle(item)}
                      >
                        <div className="copy_btn" onClick={()=> handleCopy(item.url)}>
                          <img src={copyied === item.url ? tick: copy}
                               alt="copy_btn"
                               className="w[40%] h-[40%] object-contain" />
                        </div>
                        <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                          {item.url}
                        </p>
                        <div className="copy_btn"onClick={()=>handleDelete(item.url)}>
                          <img src={deleteicon} 
                            alt="delete" 
                            className="w[40%] h-[40%] object-contain"/>
                        </div>
                      </div>
                      </>
                    ))
                  }
                 </div>
                 <div className="my-10 max-w-full flex justify-center items-center">
                  {
                    isFetching ?(
                      <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
                    )  : error ? (
                      <p className="font-inter font-bold text-black">
                        Well, that wasn't supposed to happen...
                        <br/>
                        <span className="font-satoshi font-normal">
                          {error?.data?.error}
                        </span>
                      </p>
                      
                    ) : (
                      article.summary && (
                        <div className="flex flex-col gap-3">
                          <h2 className="font-satoshi font-bold text-gray-600 text-2xl">Article <span className="blue_gradient">Summary</span></h2>
                          <div className="summary_box">
                            <p className="font-inter font-medium text-sm text-gray-700">{article.summary}</p>
                          </div>
                        </div>
                      )
                    )
                  }

                 </div>

        </form>



      </div>

    </section>
  )
}

export default Demo