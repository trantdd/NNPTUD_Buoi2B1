//HTTP request Get,post,put,delete
async function Load() {
  try {
    let res = await fetch("http://localhost:3000/posts");
    let data = await res.json();
    let body = document.getElementById("table-body");
    body.innerHTML = "";
    for (const post of data) {
      const deletedStyle = post.isDeleted
        ? 'style="text-decoration: line-through; opacity: 0.6;"'
        : "";
      body.innerHTML += `
            <tr ${deletedStyle}>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td><input value="Delete" type="submit" onclick="Delete(${post.id})" ${post.isDeleted ? "disabled" : ""} /></td>
            </tr>`;
    }
  } catch (error) {}
}
async function Save() {
  let id = document.getElementById("id_txt").value.trim();
  let title = document.getElementById("title_txt").value;
  let views = document.getElementById("views_txt").value;
  let res;

  if (id === "") {
    // Tạo mới: tính ID tự động
    let allPosts = await fetch("http://localhost:3000/posts");
    let posts = await allPosts.json();
    let maxId = 0;
    for (const post of posts) {
      let postId = parseInt(post.id);
      if (postId > maxId) {
        maxId = postId;
      }
    }
    id = String(maxId + 1);

    res = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        title: title,
        views: views,
      }),
    });
  } else {
    // Cập nhật: kiểm tra ID có tồn tại
    let getID = await fetch("http://localhost:3000/posts/" + id);
    if (getID.ok) {
      res = await fetch("http://localhost:3000/posts/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          title: title,
          views: views,
        }),
      });
    } else {
      console.log("ID không tồn tại");
      return;
    }
  }

  if (res.ok) {
    console.log("them thanh cong");
    Load();
  }
}
async function Delete(id) {
  let res = await fetch("http://localhost:3000/posts/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isDeleted: true,
    }),
  });
  if (res.ok) {
    console.log("xoa thanh cong");
    Load();
  }
}

// CRUD cho Comments
async function LoadComments() {
  try {
    let res = await fetch("http://localhost:3000/comments");
    let data = await res.json();
    let body = document.getElementById("comment-table-body");
    body.innerHTML = "";
    for (const comment of data) {
      const deletedStyle = comment.isDeleted
        ? 'style="text-decoration: line-through; opacity: 0.6;"'
        : "";
      body.innerHTML += `
            <tr ${deletedStyle}>
                <td>${comment.id}</td>
                <td>${comment.text}</td>
                <td>${comment.postId}</td>
                <td>
                  <input value="Edit" type="button" onclick="EditComment('${comment.id}')" ${comment.isDeleted ? "disabled" : ""} />
                  <input value="Delete" type="button" onclick="DeleteComment('${comment.id}')" ${comment.isDeleted ? "disabled" : ""} />
                </td>
            </tr>`;
    }
  } catch (error) {
    console.error(error);
  }
}

async function SaveComment() {
  let id = document.getElementById("comment_id_txt").value.trim();
  let text = document.getElementById("comment_text_txt").value;
  let postId = document.getElementById("comment_postId_txt").value;
  let res;

  if (id === "") {
    // Tạo mới: tính ID tự động
    let allComments = await fetch("http://localhost:3000/comments");
    let comments = await allComments.json();
    let maxId = 0;
    for (const comment of comments) {
      let commentId = parseInt(comment.id);
      if (commentId > maxId) {
        maxId = commentId;
      }
    }
    id = String(maxId + 1);

    res = await fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        text: text,
        postId: postId,
      }),
    });
  } else {
    // Cập nhật: kiểm tra ID có tồn tại
    let getID = await fetch("http://localhost:3000/comments/" + id);
    if (getID.ok) {
      res = await fetch("http://localhost:3000/comments/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          text: text,
          postId: postId,
        }),
      });
    } else {
      console.log("ID không tồn tại");
      return;
    }
  }

  if (res.ok) {
    console.log("Lưu comment thành công");
    document.getElementById("comment_id_txt").value = "";
    document.getElementById("comment_text_txt").value = "";
    document.getElementById("comment_postId_txt").value = "";
    LoadComments();
  }
}

async function EditComment(id) {
  let res = await fetch("http://localhost:3000/comments/" + id);
  if (res.ok) {
    let comment = await res.json();
    document.getElementById("comment_id_txt").value = comment.id;
    document.getElementById("comment_text_txt").value = comment.text;
    document.getElementById("comment_postId_txt").value = comment.postId;
  }
}

async function DeleteComment(id) {
  let res = await fetch("http://localhost:3000/comments/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isDeleted: true,
    }),
  });
  if (res.ok) {
    console.log("Xóa comment thành công");
    LoadComments();
  }
}

Load();
LoadComments();
