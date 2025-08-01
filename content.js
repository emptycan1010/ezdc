function getBoardPrefix(path) {
  if (path.includes('/mini/board/')) return '/mini/board';
  if (path.includes('/mgallery/board/')) return '/mgallery/board';
  return '/board';
}

function buildBoardUrl(prefix, page, params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') search.set(k, v);
  });
  return `https://gall.dcinside.com${prefix}/${page}/?${search.toString()}`;
}

document.addEventListener('keydown', function(event) {
  if (
    ['INPUT', 'TEXTAREA'].includes(event.target.tagName) || 
    (event.target.getAttribute('contenteditable') === 'true') ||
    (event.target.closest('[contenteditable="true"]'))
  ) return;
  const url = new URL(window.location.href);
  const prefix = getBoardPrefix(url.pathname);

  if (event.key === 'c') {
    // Ctrl, Alt, Meta(윈도우/커맨드) 키와 함께 눌렀을 때는 무시
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    event.preventDefault();
    const memoElement = document.querySelector('#focus_cmt > div.cmt_write_box.clear > div.cmt_txt_cont > div.cmt_write textarea');
    if (memoElement) memoElement.focus();
  } else if (event.key === 'd') {
    const refreshButton = document.querySelector('button.btn_cmt_refresh');
    if (refreshButton) refreshButton.click();
  } else if (event.key === 'r') {
    window.location.reload();
  } else if (event.key === 'g') {
    const idParam = url.searchParams.get('id');
    // From a post view, go to the recommended posts list
    if (url.hostname === 'gall.dcinside.com' && idParam && url.pathname.includes('/view')) {
      window.location.href = buildBoardUrl(prefix, 'lists', { id: idParam, exception_mode: 'recommend' });
      return;
    }

    // From a list view (including search results), go to the recommended posts list
    const validPaths = ['/mgallery/board/lists', '/mini/board/lists', '/board/lists'];
    if (validPaths.some(path => url.pathname.includes(path))) {
      // Create new search parameters, keeping only 'id'
      const newParams = new URLSearchParams();
      if (idParam) newParams.set('id', idParam);
      
      // Set exception_mode and rebuild the URL
      newParams.set('exception_mode', 'recommend');
      url.search = newParams.toString();
      window.location.href = url.toString();
    }
} else if (event.key === 's') {
    const idParam = url.searchParams.get('id');
    const exceptionMode = url.searchParams.get('exception_mode');
    if (url.hostname === 'gall.dcinside.com' && idParam && url.pathname.includes('/view')) {
      const params = { id: idParam, page: 2 };
      if (exceptionMode) params.exception_mode = exceptionMode;
      window.location.href = buildBoardUrl(prefix, 'lists', params);
    } else {
      const currentPage = parseInt(url.searchParams.get('page')) || 1;
      url.searchParams.set('page', currentPage + 1);
      window.location.href = url.toString();
    }
  } else if (event.key === 'a') {
    // Ctrl, Alt, Meta(윈도우/커맨드) 키와 함께 눌렀을 때는 무시
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    const idParam = url.searchParams.get('id');
    const exceptionMode = url.searchParams.get('exception_mode');
    if (url.hostname === 'gall.dcinside.com' && idParam && url.pathname.includes('/view')) {
      const params = { id: idParam };
      if (exceptionMode) params.exception_mode = exceptionMode;
      window.location.href = buildBoardUrl(prefix, 'lists', params);
    } else {
      const currentPage = parseInt(url.searchParams.get('page')) || 1;
      if (currentPage > 1) {
        if (currentPage === 2) {
          url.searchParams.delete('page');
        } else {
          url.searchParams.set('page', currentPage - 1);
        }//
        window.location.href = url.toString();
      }
    }
  } else if (event.key === 'w') {
    const idParam = url.searchParams.get('id');
    if (url.hostname === 'gall.dcinside.com' && idParam && (url.pathname.includes('/view') || url.pathname.includes('/lists'))) {
      window.location.href = buildBoardUrl(prefix, 'write', { id: idParam });
    }
  } else if (event.key === 'q') {
    window.scrollTo(0, 0);
  } else if (event.key === 'f') {
    // Ctrl, Alt, Meta(윈도우/커맨드) 키와 함께 눌렀을 때는 무시
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    const idParam = url.searchParams.get('id');

    // [수정됨] 글쓰기(write)나 글보기(view) 페이지에서 목록으로 이동
    if (idParam && (url.pathname.includes('/write') || url.pathname.includes('/view'))) {
      window.location.href = buildBoardUrl(prefix, 'lists', { id: idParam });
      return;
    }
    
    // 필터링된 목록(개념글, 공지, 2페이지 이상)에서 기본 목록 1페이지로 이동
    const exceptionMode = url.searchParams.get('exception_mode');
    const currentPage = parseInt(url.searchParams.get('page')) || 1;
    const noParam = url.searchParams.get('no');
    
    if ((exceptionMode === 'recommend' || exceptionMode === 'notice') || currentPage > 1 || noParam) {
      url.search = '';
      if (idParam) url.searchParams.set('id', idParam);
      window.location.href = url.toString();
    }
}
});
