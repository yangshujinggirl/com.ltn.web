//  size: 需要显示页码的个数 例如 10 页码个数是11  如果是9 页面个数就是9
function page(size,currentPage=1,totalpage=1) {
  let pageArray = [];
  // 偶数
  if(size%2 === 0){
    size +=1;
  }
  // 中间页的序号
  let middleIndex = (size-1)/2+1;
  // 总页数不够，全部显示
  if(totalpage<=size){
    for(let i=1;i<=totalpage;i++){
      pageArray.push(i)
    }
  // 总页数够
  }else{
    // 小于 中间页面
    if(currentPage<=middleIndex){
      for(let i=1;i<=size;i++){
        pageArray.push(i)
      }
    // 大于中间页面
    }else{
      // 1. 右边有足够的页面 currentPage+middleIndex <=totalpage
      // 2. 右边不够了
      if((currentPage+middleIndex-1)>totalpage){
        for(let i=totalpage-size;i<=totalpage;i++){
          pageArray.push(i)
        }
      }else{
        for(let i=(currentPage-middleIndex+1);i<=(currentPage+middleIndex-1);i++){
          pageArray.push(i)
        }
      }
    }
  }
  return pageArray;
}

module.exports = {
  page
}