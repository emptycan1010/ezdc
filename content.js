document.addEventListener('keydown', function(event) {
  // 입력 필드에서 키 입력 시 무시
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return;
  }
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  
  if (event.key === 'c') {
    event.preventDefault(); // 'c' 문자 입력 방지
    const memoElement = document.querySelector('#focus_cmt > div.cmt_write_box.clear > div.cmt_txt_cont > div.cmt_write textarea');
    if (memoElement) {
      memoElement.focus();
    }  } else if (event.key === 'd') {
    const refreshButton = document.querySelector('button.btn_cmt_refresh');
    if (refreshButton) {
      refreshButton.click();
    }
  } else if (event.key === 'r') {
    // R키: 새로고침
    window.location.reload();  } else if (event.key === 'g') {
    // G키: view 페이지에서 해당하는 lists 페이지로 이동하거나 lists 페이지에서 exception_mode=recommend 추가
    const idParam = url.searchParams.get('id');
    
    // view 페이지에서 해당하는 lists 페이지로 이동
    if (url.hostname === 'gall.dcinside.com' && idParam) {
      if (url.pathname.includes('/mini/board/view/')) {
        window.location.href = `https://gall.dcinside.com/mini/board/lists/?id=${idParam}&exception_mode=recommend`;
        return;
      } else if (url.pathname.includes('/mgallery/board/view/')) {
        window.location.href = `https://gall.dcinside.com/mgallery/board/lists/?id=${idParam}&exception_mode=recommend`;
        return;
      } else if (url.pathname.includes('/board/view/')) {
        window.location.href = `https://gall.dcinside.com/board/lists/?id=${idParam}&exception_mode=recommend`;
        return;
      }
    }
    
    // lists 페이지에서 exception_mode=recommend 추가
    const validPaths = [
      '/mgallery/board/lists/',
      '/mini/board/lists',
      '/board/lists'
    ];
    
    const isValidPath = validPaths.some(path => url.pathname.includes(path));
    
    if (isValidPath) {
      url.searchParams.set('exception_mode', 'recommend');
      url.searchParams.delete('no');
      url.searchParams.delete('page');
      window.location.href = url.toString();
    }
  } else if (event.key === 's') {
    // S키: page 값 1씩 증가
    const currentPage = parseInt(url.searchParams.get('page')) || 1;
    url.searchParams.set('page', currentPage + 1);
    window.location.href = url.toString();  } else if (event.key === 'a') {
    // A키: page 값 1씩 감소 (2 이상일 때만)
    const currentPage = parseInt(url.searchParams.get('page')) || 1;
    if (currentPage > 1) {
      if (currentPage === 2) {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', currentPage - 1);
      }
      window.location.href = url.toString();
    }  } else if (event.key === 'f') {
    // F키: 특정 조건에서 id를 제외한 모든 URL 파라미터 삭제 또는 특별한 이동
    const exceptionMode = url.searchParams.get('exception_mode');
    const currentPage = parseInt(url.searchParams.get('page')) || 1;
    const noParam = url.searchParams.get('no');
      // gall.dcinside.com에서 view 페이지일 때 해당하는 lists 페이지로 이동
    if (url.hostname === 'gall.dcinside.com') {
      const idParam = url.searchParams.get('id');
      if (idParam) {
        if (url.pathname.includes('/mini/board/view/')) {
          window.location.href = `https://gall.dcinside.com/mini/board/lists/?id=${idParam}`;
          return;
        } else if (url.pathname.includes('/mgallery/board/view/')) {
          window.location.href = `https://gall.dcinside.com/mgallery/board/lists/?id=${idParam}`;
          return;
        } else if (url.pathname.includes('/board/view/')) {
          window.location.href = `https://gall.dcinside.com/board/lists/?id=${idParam}`;
          return;
        }
      }
    }
    
    // gall.dcinside.com/mini/board/view/ URL일 때 특별한 처리
    if (url.hostname === 'gall.dcinside.com' && url.pathname.includes('/mini/board/view/')) {
      const idParam = url.searchParams.get('id');
      if (idParam) {
        window.location.href = `https://gall.dcinside.com/mini/board/lists/?id=${idParam}`;
      }
      return;
    }
    
    if ((exceptionMode === 'recommend' || exceptionMode === 'notice') || currentPage >= 2 || noParam) {
      // id 파라미터만 보존
      const idParam = url.searchParams.get('id');
      
      // 모든 파라미터 삭제
      url.search = '';
      
      // id 파라미터가 있었다면 다시 추가
      if (idParam) {
        url.searchParams.set('id', idParam);
      }
      
      window.location.href = url.toString();
    }
  }
});
