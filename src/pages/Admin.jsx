import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { formatPrice } from "../store";
import { useProducts } from "../products.jsx";
import { api, assetUrl } from "../api.js";

const CATEGORIES = ["جنط", "جديدنا", "الأكثر مبيعًا", "عروض"];
const MAX_IMAGES = 12;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const createBlankForm = () => ({
  name: "",
  brand: "ZERA",
  price: "",
  oldPrice: "",
  category: "جنط",
  badge: "",
  colors: "",
  colorImages: {},
  stock: "",
  image: "",
  images: [],
  desc: "",
  featured: false,
});

export default function Admin() {
  const { products, refresh } = useProducts();

  const [logged, setLogged] = useState(
    () => !!localStorage.getItem("zera_admin_token")
  );
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(createBlankForm);

  const updateForm = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!logged) return;

    api("/api/admin/me").catch(() => {
      localStorage.removeItem("zera_admin_token");
      setLogged(false);
    });
  }, [logged]);

  const login = async (event) => {
    event.preventDefault();

    setBusy(true);
    setErr("");

    try {
      const response = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password: pass,
        }),
      });

      if (!response?.token) {
        throw new Error("لم يتم استلام رمز الدخول من الخادم.");
      }

      localStorage.setItem("zera_admin_token", response.token);
      setLogged(true);
      setPass("");
    } catch (error) {
      setErr(error?.message || "حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("zera_admin_token");
    setLogged(false);
    setEmail("");
    setPass("");
    setErr("");
  };

  const openAdd = () => {
    setEditId(null);
    setForm(createBlankForm());
    setErr("");
    setModal(true);
  };

  const openEdit = (product) => {
    const images = Array.isArray(product.images)
      ? product.images
      : product.image
        ? [product.image]
        : [];

    setEditId(product.id);

    setForm({
      name: product.name || "",
      brand: product.brand || "",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      category: product.category || "جنط",
      badge: product.badge || "",
      colors: Array.isArray(product.colors)
        ? product.colors.join(", ")
        : product.colors || "",
      colorImages: product.colorImages || {},
      stock: product.stock ?? 0,
      image: product.image || images[0] || "",
      images,
      desc: product.desc || "",
      featured: !!product.featured,
    });

    setErr("");
    setModal(true);
  };

  const upload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    if (files.length > MAX_IMAGES) {
      setErr(`اختاري حتى ${MAX_IMAGES} صورة فقط.`);
      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > MAX_IMAGE_SIZE
    );

    if (invalidFile) {
      setErr("الصور يجب أن تكون JPG أو PNG أو WEBP، وحجم كل صورة أقل من 4MB.");
      event.target.value = "";
      return;
    }

    const currentImages = form.images || [];

    if (currentImages.length + files.length > MAX_IMAGES) {
      setErr(
        `لا يمكن أن يتجاوز مجموع صور المنتج ${MAX_IMAGES} صورة.`
      );
      event.target.value = "";
      return;
    }

    setBusy(true);
    setErr("");

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api("/api/admin/upload/product", {
          method: "POST",
          body: formData,
        });

        if (!response?.url) {
          throw new Error("الخادم لم يرجع رابط الصورة.");
        }

        uploadedUrls.push(response.url);
      }

      setForm((current) => {
        const images = [...(current.images || []), ...uploadedUrls].slice(
          0,
          MAX_IMAGES
        );

        return {
          ...current,
          image: current.image || images[0] || "",
          images,
        };
      });
    } catch (error) {
      setErr(error?.message || "حدث خطأ أثناء رفع الصور.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  const removeImage = (index) => {
    setForm((current) => {
      const images = (current.images || []).filter(
        (_, imageIndex) => imageIndex !== index
      );

      const removedImage = current.images?.[index];
      const mainImage =
        current.image === removedImage
          ? images[0] || ""
          : current.image;

      return {
        ...current,
        images,
        image: mainImage,
      };
    });
  };

  const save = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const price = Number(form.price);
    const oldPrice =
      form.oldPrice === "" ? null : Number(form.oldPrice);
    const stock = Math.max(0, Number(form.stock) || 0);
    const images = (form.images || []).slice(0, MAX_IMAGES);

    if (!name) {
      setErr("اكتبي اسم المنتج.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setErr("اكتبي سعرًا صحيحًا.");
      return;
    }

    if (
      oldPrice !== null &&
      (!Number.isFinite(oldPrice) || oldPrice < 0)
    ) {
      setErr("اكتبي السعر القديم بشكل صحيح.");
      return;
    }

    setBusy(true);
    setErr("");

    try {
      const payload = {
        name,
        brand: form.brand.trim() || null,
        price,
        oldPrice,
        category: form.category,
        badge: form.badge.trim() || null,
        colors: form.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),
        colorImages: form.colorImages || {},
        sizes: [],
        stock,
        image: form.image || images[0] || null,
        images,
        desc: form.desc.trim(),
        featured: !!form.featured,
      };

      if (editId) {
        await api(`/api/admin/products/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      await refresh();
      setModal(false);
      setEditId(null);
      setForm(createBlankForm());
    } catch (error) {
      setErr(error?.message || "حدث خطأ أثناء حفظ المنتج.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("هل أنتِ متأكدة من حذف هذا المنتج؟")) {
      return;
    }

    setBusy(true);
    setErr("");

    try {
      await api(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      await refresh();
    } catch (error) {
      setErr(error?.message || "حدث خطأ أثناء حذف المنتج.");
    } finally {
      setBusy(false);
    }
  };

  if (!logged) {
    return (
      <div
        dir="rtl"
        style={{
          minHeight: "100vh",
          background: "var(--navy)",
          display: "grid",
          placeItems: "center",
          padding: 20,
        }}
      >
        <form
          onSubmit={login}
          style={{
            background: "var(--cream)",
            padding: 40,
            width: "min(420px, 100%)",
            borderRadius: 12,
          }}
        >
          <div
            className="brand"
            style={{
              color: "var(--navy)",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <span
              className="badge"
              style={{
                borderColor: "var(--navy)",
                color: "var(--navy)",
              }}
            >
              Z
            </span>
            ZERA
          </div>

          <p
            style={{
              color: "#8a7f72",
              fontSize: 13,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            دخول لوحة التحكم الآمنة
          </p>

          <div className="field">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="field">
            <label>كلمة المرور</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={pass}
              onChange={(event) => setPass(event.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-navy btn-block"
            disabled={busy}
          >
            {busy ? "جاري الدخول..." : "دخول"}
          </button>

          {err && (
            <p
              role="alert"
              style={{
                color: "#b5493f",
                fontSize: 13,
                marginTop: 12,
                textAlign: "center",
              }}
            >
              {err}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 34,
            flexWrap: "wrap",
          }}
        >
          <div
            className="brand"
            style={{
              color: "var(--white)",
            }}
          >
            <span className="badge">Z</span>
            لوحة تحكم ZERA
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              className="btn btn-outline-navy btn-sm"
            >
              عرض الموقع
            </Link>

            <button
              type="button"
              className="btn btn-navy btn-sm"
              onClick={logout}
              disabled={busy}
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {err && (
          <p
            role="alert"
            style={{
              color: "#ffb4aa",
              marginBottom: 14,
            }}
          >
            {err}
          </p>
        )}

        <div
          className="admin-card"
          style={{
            background: "var(--white)",
            padding: 26,
            border: "1px solid var(--line)",
            borderRadius: 12,
            overflowX: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <h3>المنتجات ({products.length})</h3>

            <button
              type="button"
              className="btn btn-navy btn-sm"
              onClick={openAdd}
              disabled={busy}
            >
              + إضافة منتج
            </button>
          </div>

          <table
            className="admin-table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 700,
            }}
          >
            <thead>
              <tr>
                {["المنتج", "الماركة", "القسم", "السعر", "المخزون", ""].map(
                  (title, index) => (
                    <th
                      key={`${title}-${index}`}
                      style={{
                        textAlign: "right",
                        padding: "12px 8px",
                        borderBottom: "2px solid var(--navy)",
                        fontSize: 13,
                      }}
                    >
                      {title}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom: "1px solid var(--line)",
                      fontSize: 14,
                    }}
                  >
                    {product.name}
                  </td>

                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom: "1px solid var(--line)",
                      fontSize: 14,
                    }}
                  >
                    {product.brand || "—"}
                  </td>

                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom: "1px solid var(--line)",
                      fontSize: 14,
                    }}
                  >
                    {product.category}
                  </td>

                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom: "1px solid var(--line)",
                      fontSize: 14,
                    }}
                  >
                    {formatPrice(product.price)}
                  </td>

                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom: "1px solid var(--line)",
                      fontSize: 14,
                    }}
                  >
                    {product.stock}
                  </td>

                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom: "1px solid var(--line)",
                      fontSize: 14,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      style={{
                        color: "var(--gold)",
                        fontWeight: 700,
                        marginLeft: 14,
                      }}
                      disabled={busy}
                    >
                      تعديل
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      style={{
                        color: "#b5493f",
                        fontWeight: 700,
                      }}
                      disabled={busy}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13,25,41,.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 20,
          }}
          onClick={() => !busy && setModal(false)}
        >
          <form
            onClick={(event) => event.stopPropagation()}
            onSubmit={save}
            style={{
              background: "var(--white)",
              padding: 32,
              maxWidth: 560,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              borderRadius: 12,
            }}
          >
            <h3 style={{ marginBottom: 20 }}>
              {editId ? "تعديل المنتج" : "إضافة منتج"}
            </h3>

            <div className="field">
              <label>اسم المنتج</label>
              <input
                required
                maxLength={120}
                value={form.name}
                onChange={(event) =>
                  updateForm("name", event.target.value)
                }
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label>الماركة</label>
                <input
                  maxLength={80}
                  value={form.brand}
                  onChange={(event) =>
                    updateForm("brand", event.target.value)
                  }
                />
              </div>

              <div className="field">
                <label>المخزون</label>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={form.stock}
                  onChange={(event) =>
                    updateForm("stock", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>السعر</label>
                <input
                  type="number"
                  min="0"
                  max="100000000"
                  step="1"
                  required
                  value={form.price}
                  onChange={(event) =>
                    updateForm("price", event.target.value)
                  }
                />
              </div>

              <div className="field">
                <label>السعر القديم</label>
                <input
                  type="number"
                  min="0"
                  max="100000000"
                  step="1"
                  value={form.oldPrice}
                  onChange={(event) =>
                    updateForm("oldPrice", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="field">
              <label>القسم</label>
              <select
                value={form.category}
                onChange={(event) =>
                  updateForm("category", event.target.value)
                }
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>الألوان (افصلي بينها بفاصلة)</label>
              <input
                value={form.colors}
                onChange={(event) =>
                  updateForm("colors", event.target.value)
                }
              />
            </div>

            <div className="field">
              <label>الوصف</label>
              <textarea
                rows={4}
                maxLength={1000}
                value={form.desc}
                onChange={(event) =>
                  updateForm("desc", event.target.value)
                }
              />
            </div>

            <div className="field">
              <label>صور الجنطة (حتى {MAX_IMAGES} صورة)</label>

              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={upload}
                disabled={busy}
              />

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 10,
                }}
              >
                {(form.images || []).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    style={{
                      position: "relative",
                    }}
                  >
                    <img
                      src={assetUrl(image)}
                      alt={`صورة ${index + 1} للمنتج`}
                      style={{
                        width: 82,
                        height: 82,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={busy}
                      aria-label={`حذف الصورة ${index + 1}`}
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "#b5493f",
                        color: "white",
                        borderRadius: 4,
                        padding: "2px 6px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <small
                style={{
                  display: "block",
                  marginTop: 8,
                  color: "#8a7f72",
                }}
              >
                أول صورة هي الرئيسية. يمكنك إضافة صور متعددة للمنتج.
              </small>
            </div>

            <label
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  updateForm("featured", event.target.checked)
                }
              />
              منتج مميز
            </label>

            {err && (
              <p
                role="alert"
                style={{
                  color: "#b5493f",
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                {err}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <button
                type="submit"
                className="btn btn-navy"
                disabled={busy}
              >
                {busy ? "جاري الحفظ..." : "حفظ"}
              </button>

              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={() => setModal(false)}
                disabled={busy}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
