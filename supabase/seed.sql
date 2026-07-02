SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict KgMvhw5PgXitAmL9gSUjpOiaM0oAckgIZ1TZQScHuYZbRfVVYRYAtGccZADc56d

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: payload_folders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."media" ("id", "alt", "caption", "folder_id", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y", "prefix") VALUES
	(1, 'LV Mens Jacquard Jacket from SS18 in Turquoise', NULL, NULL, '2026-06-30 10:21:43.776+00', '2026-06-30 10:21:43.013+00', '/api/media/file/testimage.jpg', NULL, 'testimage.jpg', 'image/jpeg', 490204, 1800, 2400, 50, 50, 'media'),
	(2, 'Back view', NULL, NULL, '2026-06-30 13:57:42.408+00', '2026-06-30 13:57:42.185+00', '/api/media/file/testimageback.jpg', NULL, 'testimageback.jpg', 'image/jpeg', 365470, 1280, 1280, 50, 50, 'media'),
	(5, '1.jpg', NULL, NULL, '2026-06-30 15:34:24.313+00', '2026-06-30 15:34:23.65+00', '/api/media/file/1.jpg', NULL, '1.jpg', 'image/jpeg', 26496, 655, 468, 50, 50, 'media'),
	(6, 'nike-ja-3-turquoise-red-3.webp', NULL, NULL, '2026-06-30 15:34:39.694+00', '2026-06-30 15:34:39.502+00', '/api/media/file/nike-ja-3-turquoise-red-3.webp', NULL, 'nike-ja-3-turquoise-red-3.webp', 'image/webp', 120762, 1140, 1140, 50, 50, 'media'),
	(7, '24.webp', NULL, NULL, '2026-06-30 15:34:40.1+00', '2026-06-30 15:34:39.9+00', '/api/media/file/24.webp', NULL, '24.webp', 'image/webp', 38904, 740, 740, 50, 50, 'media'),
	(8, 'saint_laurent_cat-eye_irregular_sunglasses_black_f_0_32778.avif', NULL, NULL, '2026-06-30 15:38:23.717+00', '2026-06-30 15:38:23.229+00', '/api/media/file/saint_laurent_cat-eye_irregular_sunglasses_black_f_0_32778.avif', NULL, 'saint_laurent_cat-eye_irregular_sunglasses_black_f_0_32778.avif', 'image/avif', 879, 133, 64, 50, 50, 'media'),
	(9, 'saint_laurent_cat-eye_irregular_sunglasses_black_f_3_32779.avif', NULL, NULL, '2026-06-30 15:38:24.132+00', '2026-06-30 15:38:23.923+00', '/api/media/file/saint_laurent_cat-eye_irregular_sunglasses_black_f_3_32779.avif', NULL, 'saint_laurent_cat-eye_irregular_sunglasses_black_f_3_32779.avif', 'image/avif', 852, 126, 64, 50, 50, 'media');


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _pages_v; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _pages_v_blocks_archive; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _pages_v_blocks_content; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _pages_v_blocks_content_columns; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _pages_v_blocks_cta; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _pages_v_blocks_cta_links; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _pages_v_blocks_form_block; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _pages_v_blocks_media_block; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "title", "generate_slug", "slug", "parent_id", "updated_at", "created_at", "category_name", "description") VALUES
	(1, 'T-Shirts & Tops', false, 't-shirts-tops', NULL, '2026-06-30 09:27:46.027+00', '2026-06-30 09:15:30.554+00', 'T-Shirts & Tops', 'T-shirts, shirts, blouses, and wearable tops.'),
	(2, 'Jeans', false, 'jeans', NULL, '2026-06-30 09:27:46.076+00', '2026-06-30 09:15:30.58+00', 'Jeans', 'Denim jeans and jean-style bottoms.'),
	(3, 'Pants & Bottoms', false, 'pants-bottoms', NULL, '2026-06-30 09:27:46.092+00', '2026-06-30 09:15:30.605+00', 'Pants & Bottoms', 'Pants, shorts, skirts, and other bottoms.'),
	(4, 'Hats & Caps', false, 'hats-caps', NULL, '2026-06-30 09:27:46.108+00', '2026-06-30 09:15:30.622+00', 'Hats & Caps', 'Hats, caps, beanies, and headwear.'),
	(5, 'Jackets & Outerwear', false, 'jackets-outerwear', NULL, '2026-06-30 09:27:46.124+00', '2026-06-30 09:15:30.639+00', 'Jackets & Outerwear', 'Jackets, hoodies, sweaters, and outerwear.'),
	(6, 'Footwear', false, 'footwear', NULL, '2026-06-30 15:04:20.241+00', '2026-06-30 15:04:20.092+00', 'Footwear', 'Shoes, sandals, slippers and more.'),
	(7, 'Accessories', false, 'accessories', NULL, '2026-06-30 15:37:35.867+00', '2026-06-30 15:37:35.734+00', 'Accesories', 'Sunglasses, rings, bracelets and more.');


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _pages_v_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _pages_v_version_hero_links; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _posts_v; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "name", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until", "full_name", "phone_number", "profile_image_id", "role", "account_status") VALUES
	(2, 'Ahmad Hussein', '2026-06-30 14:18:13.879+00', '2026-06-30 14:18:13.878+00', 'a.hussein@gmail.com', NULL, NULL, '2b7ae91c115385ac2d1239d1a0431e6d2551e3660aa5fe82165f74c80a620536', '680d37b406c762131dc1f6b47e3364ee83e77beac7b84c9ae0dd1897eb0a1c3dbb4cf89b0f0368351d92acc52dd6652053d5e69187171aacc706b2093f2e8817b9514cfbac9db934e61cd76a4e26638568465529c8ec59cf62c31531762594aa3ebd1879f60944259ade23a32befbc0001929620285c2014de26c181e8663767d5db83e4398cbc7b801e1e6e16b11279f214306bbd83b2b0b1d16a41a057666dc6b0a9096278f61cd832f15efdb6590f6a42280e5090ec296d780870c3ceaeb7ba70bea521ff7c0818f61d2640495806cf1064aac7161e094ae706a3d539b1b3f51c31c4fffcd59b516bfc841b30fe398e1e4d7717789f63c437adbaf6a00e105035c2b78b2b7ab953450eaa556e21318a28d3e9cadc9a9e6e88669484b0e4b2eb926f7d053f537c1474a20ac948abcf953edb2236e58401183ded6085910e49effa4df0ca4f8f8f32b275b5fdf56093f32b92d01031cd90304976af3181e345ab9d6afd8d82f4d0c822c6e7ed97e76e0cb265f7a586e15e7c1c818bdb811a5e9904f3c219e03a1582ebf0a46b9f0e225f6a4c1c6a2a5aaa7aa497c3ca7f75297d0c23551902cf2e040af25161d00f9343ec78c8ba80882bdd034c060824e7caed8bbc7a0d6dc0e8a82fa5766f363e3f4ec18f0ecf88a987e6376f5a94f975f74b89b90eae317a296186c5c2e36854f9c01abe0a033070f23269c82f6c65e0e8', 0, NULL, 'Ahmad Hussein', '+60129912124', NULL, 'customer', 'active'),
	(1, 'Adam Dicky', '2026-06-30 15:42:24.511+00', '2026-06-29 14:34:44.751+00', 'admdcky@gmail.com', NULL, NULL, '283db058c95c4cb54ded610439ee9658ede3e62f9b0a50a14cc1b957cf896b57', '031bc94be66f737e602167a0028bb6812f121ed764d880cdfbf57ea4ca9a108fb630e9fc4cba3d3ef958c541393d69628351cad22e44efb7392d959bdafc50101697a2cc2c1cf324f609f02b17ac63d30ae00528b3e2a904bc9b4aa20091e48771e122d6f1d516943fab8d72d99b88a40014be1d693d85e09c605f847a062cf52695ad6d8fdf45e8b8ecad25f7f126f1f49c552f04bfbb9252f53ea8e363812536b4a657c69469181ae552d3318ba76e4e8e6e8f22710b55a9ff53d00e7dd4ec2275f56b899d92c4dba5ac64e762f2359878dfd71a7e1e2c3a1c115df3239bef4200f1a891e1d07f065db68153e5b3edf7a3bf50532a2fb0259417b23bd73b4e7a84bfb9848a9e11969441b38a9c63e6849dbc1e33288e5f8b43619d2f7a1f5feeeab885aeeec148a2fa903304b602ac47d5ea8deb09043706ef627de2386c927ce6f8d93ebd3340a8b661d744018253276c7966c91ae532e928a84c1feabaf4e59ddf50084d71df71227cbddb4d6cd48ac389a53cb3aff82add2f7833ed271cccb530ff0f93893006744af02efd7926786347e26753fb5049b090deb4a0aa1fa098c07da324dfa6d659a04d0cf08f43b05261fa9818ed9b311b72ac78f80588285fd0e4467aee81817412d1276e01c0d774d7e08615a13a23fa7490cb533966113c3494109a31a6686e8c45e1fa7c280109226507a82b954f1c60e2b25c242f', 0, NULL, 'Adam Dicky', NULL, NULL, 'admin', 'active'),
	(12, 'haziq rashid', '2026-07-01 05:02:00.852+00', '2026-07-01 05:02:00.851+00', 'haziqrashid20@gmail.com', NULL, NULL, 'c392af85427f059ccf9e5a372e9562f5a8d8818cacd41d16c7f2d9b335147d2f', '2c7d199584d13b27bd57263f1dc55626062fc3952d76f91265202ff8003a2b71f97ef1f3c10a676d728b5d64f35b009cda25d2e088ecb1c48678927206e9363f762d54d441375b72685aae86a6178fa19d3965090dc1ee06e716742df56d5e19ba55ec3732fa3065a06a30b49fdfe05b3b66673002bf7567086c2b17b7a89eda94849cf81dda88d4ca4ad7821967cb53056d4db6e7928dee55306a93f532ef60732f9b13b248a52e4664d8c2a6b7a3108eb624fd754e2c0b9e243baea22f349b9c63be86d04b34ab5a5384c33dc82c8575338c79c85ff19117fd1ec59171e15e4229484a9f11136014e3754c95837fab6a89ec1593e7e1c764b018c8ad1ba071840f93367ae759ba0d400c07a2f75dfd7c72c477fbfad42ab1b83b7c797d0c8f9744aeabe577427eeac6f7db49f8bc340bafd7266793794bbf1dd125eb4e2ff7cf78e05029fe8ebbcc3a0d27269a15f1f578700cc102c742f764d3ddb304f86a2eb4a2a8629eac2790021705137496fd2ea9b403205b6d83c62cbb0a3146d6c4df34acf621cc566a9b366edb77d369cf0cd8d9e7b94420eb83d0c7e4f77ba1a9a3abf14f35d09f3a27441678d80046f4abd8ff25c83d97287eb705ba5136f721e48f2cddb4e525110d56743cbc1083f7b1945be109479333e3cef08482d8fb18fb700268fe9b337168ce681e200af4b959b434e694d4efeeff38215a6d9aa180', 0, NULL, 'haziq rashid', '+601157593598', NULL, 'customer', 'active');


--
-- Data for Name: _posts_v_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _posts_v_version_populated_authors; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "seller_id", "category_id", "product_name", "description", "base_price", "status", "featured", "updated_at", "created_at") VALUES
	(3, 1, 5, 'LV Mens Jacquard Jacket', 'LV Mens Jacquard Jacket from SS18', 9000, 'available', false, '2026-06-30 10:21:42.685+00', '2026-06-30 10:21:42.684+00'),
	(5, 2, 6, 'Nike Ja 3 ''Twelve Time''', 'Experience unparalleled performance with the Nike Ja 3 Twelve Time IQ6755-300, a basketball shoe designed for exceptional speed, agility, and support on the court. Lightweight and responsive, this model offers premium cushioning with Nike''s advanced Zoom Air unit, ensuring comfort during intense gameplay.', 460, 'hidden', false, '2026-06-30 15:33:10.262+00', '2026-06-30 15:32:18.626+00'),
	(4, 2, 6, 'Nike Ja 3 ''Twelve Time''', 'Experience unparalleled performance with the Nike Ja 3 Twelve Time IQ6755-300, a basketball shoe designed for exceptional speed, agility, and support on the court. Lightweight and responsive, this model offers premium cushioning with Nike''s advanced Zoom Air unit, ensuring comfort during intense gameplay.', 460, 'hidden', false, '2026-06-30 15:33:20.685+00', '2026-06-30 15:29:19.58+00'),
	(6, 2, 6, 'Nike Ja 3 ''Twelve Time''', 'Experience unparalleled performance with the Nike Ja 3 Twelve Time IQ6755-300, a basketball shoe designed for exceptional speed, agility, and support on the court. Lightweight and responsive, this model offers premium cushioning with Nike''s advanced Zoom Air unit, ensuring comfort during intense gameplay.', 460, 'available', false, '2026-06-30 15:34:22.982+00', '2026-06-30 15:34:22.982+00'),
	(1, 1, 1, 'H&M Oversized Cotton Tee', 'H&M Oversized Cotton Tee, Pit 19 Labuh 21', 20, 'hidden', false, '2026-06-30 15:36:02.911+00', '2026-06-30 09:32:22.124+00'),
	(2, 1, 2, 'H&M Barrel Jeans', 'H&M Barrel Jeans, from size 28-36.', 120, 'hidden', false, '2026-06-30 15:36:07.751+00', '2026-06-30 09:52:52.217+00'),
	(7, 1, 7, 'SAINT LAURENT Cat-Eye Irregular Sunglasses Black Frame', 'Elevate your style with the SAINT LAURENT Cat-Eye Irregular Sunglasses, featuring a bold black frame and sleek, distinctive design. Perfectly crafted to combine glamour with modern edge, these sunglasses redefine sophistication while providing optimal UV protection. The unconventional cat-eye shape enhances your face, making it a statement accessory for any occasion.', 1475, 'available', false, '2026-06-30 15:38:22.89+00', '2026-06-30 15:38:22.89+00');


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."product_variants" ("id", "product_id", "color", "size", "additional_price", "updated_at", "created_at") VALUES
	(1, 1, 'Grey', 'M', 0, '2026-06-30 09:32:22.324+00', '2026-06-30 09:32:22.324+00'),
	(2, 2, 'Blue', '28', 0, '2026-06-30 09:52:52.376+00', '2026-06-30 09:52:52.375+00'),
	(3, 2, 'Blue', '29', 0, '2026-06-30 09:53:12.93+00', '2026-06-30 09:53:12.93+00'),
	(4, 3, 'Turquoise', 'L', 0, '2026-06-30 10:21:42.791+00', '2026-06-30 10:21:42.791+00'),
	(5, 4, 'Turquoise', 'UK9', 0, '2026-06-30 15:29:19.689+00', '2026-06-30 15:29:19.689+00'),
	(6, 4, 'Turquoise', 'UK7', 0, '2026-06-30 15:29:19.936+00', '2026-06-30 15:29:19.936+00'),
	(7, 4, 'Turquoise', 'UK10', 0, '2026-06-30 15:29:20.144+00', '2026-06-30 15:29:20.144+00'),
	(8, 5, 'Turquoise', 'UK10', 0, '2026-06-30 15:32:18.736+00', '2026-06-30 15:32:18.736+00'),
	(9, 5, 'Turquoise', 'UK11', 0, '2026-06-30 15:32:18.944+00', '2026-06-30 15:32:18.944+00'),
	(10, 5, 'Turquoise', 'UK7', 0, '2026-06-30 15:32:19.155+00', '2026-06-30 15:32:19.155+00'),
	(11, 6, 'Turquoise', 'UK10', 0, '2026-06-30 15:34:23.075+00', '2026-06-30 15:34:23.075+00'),
	(12, 6, 'Turquoise', 'UK9', 0, '2026-06-30 15:34:23.266+00', '2026-06-30 15:34:23.266+00'),
	(13, 6, 'Turquoise', 'UK11', 0, '2026-06-30 15:34:23.45+00', '2026-06-30 15:34:23.45+00'),
	(14, 7, 'Black', 'OSFA', 0, '2026-06-30 15:38:22.986+00', '2026-06-30 15:38:22.986+00');


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: categories_breadcrumbs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories_breadcrumbs" ("_order", "_parent_id", "id", "doc_id", "url", "label") VALUES
	(1, 6, '6a43daf44a8a661853211398', 6, '/footwear', 'Footwear'),
	(1, 7, '6a43e2bfcac5831eed7d0c1e', 7, '/accessories', 'Accessories');


--
-- Data for Name: footer; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: footer_nav_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: footer_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: form_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: form_submissions_submission_data; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_blocks_checkbox; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_blocks_country; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_blocks_email; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_blocks_message; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_blocks_number; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_blocks_select; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_blocks_select_options; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_blocks_state; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_blocks_text; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_blocks_textarea; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forms_emails; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: header; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: header_nav_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: header_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."inventory" ("id", "variant_id", "stock_quantity", "reserved_quantity", "updated_at", "created_at") VALUES
	(1, 1, 1, 0, '2026-06-30 09:43:49.906+00', '2026-06-30 09:32:22.483+00'),
	(2, 2, 3, 0, '2026-06-30 09:52:52.492+00', '2026-06-30 09:52:52.492+00'),
	(3, 3, 4, 0, '2026-06-30 09:53:13.057+00', '2026-06-30 09:53:13.057+00'),
	(4, 4, 1, 0, '2026-06-30 10:21:42.899+00', '2026-06-30 10:21:42.899+00'),
	(5, 5, 10, 0, '2026-06-30 15:29:19.817+00', '2026-06-30 15:29:19.817+00'),
	(6, 6, 3, 0, '2026-06-30 15:29:20.052+00', '2026-06-30 15:29:20.052+00'),
	(7, 7, 2, 0, '2026-06-30 15:29:20.253+00', '2026-06-30 15:29:20.253+00'),
	(8, 8, 10, 0, '2026-06-30 15:32:18.846+00', '2026-06-30 15:32:18.846+00'),
	(9, 9, 3, 0, '2026-06-30 15:32:19.056+00', '2026-06-30 15:32:19.056+00'),
	(10, 10, 2, 0, '2026-06-30 15:32:19.263+00', '2026-06-30 15:32:19.263+00'),
	(11, 11, 2, 0, '2026-06-30 15:34:23.18+00', '2026-06-30 15:34:23.18+00'),
	(12, 12, 9, 0, '2026-06-30 15:34:23.366+00', '2026-06-30 15:34:23.366+00'),
	(13, 13, 1, 0, '2026-06-30 15:34:23.553+00', '2026-06-30 15:34:23.553+00'),
	(14, 14, 10, 0, '2026-06-30 15:38:23.097+00', '2026-06-30 15:38:23.097+00');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pages_blocks_archive; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pages_blocks_content; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pages_blocks_content_columns; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pages_blocks_cta; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pages_blocks_cta_links; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pages_blocks_form_block; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pages_blocks_media_block; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pages_hero_links; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pages_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payload_folders_folder_type; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payload_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payload_jobs_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payload_kv; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payload_locked_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."product_images" ("id", "product_id", "image_id", "display_order", "updated_at", "created_at") VALUES
	(1, 3, 1, 0, '2026-06-30 13:57:55.274+00', '2026-06-30 10:21:43.823+00'),
	(2, 3, 2, 1, '2026-06-30 13:57:55.368+00', '2026-06-30 13:57:42.455+00'),
	(4, 6, 6, 1, '2026-06-30 15:34:47.132+00', '2026-06-30 15:34:39.736+00'),
	(3, 6, 5, 0, '2026-06-30 15:34:47.133+00', '2026-06-30 15:34:24.363+00'),
	(5, 6, 7, 2, '2026-06-30 15:34:47.134+00', '2026-06-30 15:34:40.143+00'),
	(6, 7, 8, 0, '2026-06-30 15:38:23.762+00', '2026-06-30 15:38:23.762+00'),
	(7, 7, 9, 1, '2026-06-30 15:38:24.176+00', '2026-06-30 15:38:24.176+00');


--
-- Data for Name: redirects; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: search; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payload_locked_documents_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payload_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."payload_migrations" ("id", "name", "batch", "updated_at", "created_at") VALUES
	(1, 'dev', -1, '2026-07-01 08:17:20.6+00', '2026-06-29 14:34:14.834+00');


--
-- Data for Name: payload_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."payload_preferences" ("id", "key", "value", "updated_at", "created_at") VALUES
	(1, 'collection-categories', '{"editViewType": "default"}', '2026-06-30 15:03:57.212+00', '2026-06-30 15:03:52.057+00'),
	(2, 'collection-categories', '{"editViewType": "default"}', '2026-06-30 15:37:11.701+00', '2026-06-30 15:37:09.73+00'),
	(3, 'collection-users', '{"editViewType": "default"}', '2026-06-30 15:42:14.971+00', '2026-06-30 15:42:05.996+00');


--
-- Data for Name: payload_preferences_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."payload_preferences_rels" ("id", "order", "parent_id", "path", "users_id") VALUES
	(2, NULL, 1, 'user', 2),
	(4, NULL, 2, 'user', 1),
	(6, NULL, 3, 'user', 2);


--
-- Data for Name: posts_populated_authors; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: posts_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: redirects_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: search_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: search_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users_sessions" ("_order", "_parent_id", "id", "created_at", "expires_at") VALUES
	(1, 2, '9ea09a70-cd7c-4696-9d40-6d5095802900', '2026-06-30 14:54:36.25+00', '2026-06-30 16:54:36.25+00'),
	(2, 2, '61405462-d35b-470a-bbd3-d7474bcb2408', '2026-06-30 15:38:32.071+00', '2026-06-30 17:38:32.071+00'),
	(3, 2, 'c248943a-c54e-4e97-89c9-c0efd969edc8', '2026-06-30 16:06:46.854+00', '2026-06-30 18:06:46.854+00'),
	(4, 2, 'f13a6326-ffb2-4e19-9ae0-0197133d5554', '2026-06-30 16:41:46.985+00', '2026-06-30 18:41:46.985+00'),
	(1, 1, '964ea086-997f-42a8-a8ac-075099ec6e28', '2026-06-30 15:35:08.426+00', '2026-06-30 17:35:08.426+00'),
	(2, 1, '8b8c3b6a-9418-4cbb-bded-1898c9d58bc9', '2026-06-30 16:05:26.979+00', '2026-06-30 18:05:26.979+00'),
	(3, 1, 'd0da8a7d-acda-43a6-9682-0f80989f5f3f', '2026-06-30 16:43:57.659+00', '2026-06-30 18:43:57.659+00'),
	(1, 12, 'af474ad4-85ab-4380-ae0f-1c64367c297b', '2026-07-01 07:12:40.225+00', '2026-07-01 09:12:40.225+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('ejual-media', 'ejual-media', NULL, '2026-06-30 10:16:26.939268+00', '2026-06-30 10:16:26.939268+00', true, false, 5242880, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('a1b33d45-ca12-430e-a3f2-f7f6eb75b17c', 'ejual-media', 'media/testimage.jpg', NULL, '2026-06-30 10:21:43.600119+00', '2026-06-30 10:21:43.600119+00', '2026-06-30 10:21:43.600119+00', '{"eTag": "\"5b1770d278ed9b178f55f84fb4b0a0c3\"", "size": 490204, "mimetype": "image/jpeg", "cacheControl": "no-cache", "lastModified": "2026-06-30T10:21:44.000Z", "contentLength": 490204, "httpStatusCode": 200}', 'be48e153-06cc-4f98-81f3-cd6729d63b75', NULL, '{}'),
	('e189ceb7-9245-483c-bbaa-cb892a1b3877', 'ejual-media', 'media/testimageback.jpg', NULL, '2026-06-30 13:57:42.331946+00', '2026-06-30 13:57:42.331946+00', '2026-06-30 13:57:42.331946+00', '{"eTag": "\"5e1eca6805cb2831c351aa6bcf4c393c\"", "size": 365470, "mimetype": "image/jpeg", "cacheControl": "no-cache", "lastModified": "2026-06-30T13:57:43.000Z", "contentLength": 365470, "httpStatusCode": 200}', '5365533d-57d1-467c-8ab3-9b18393e1a6e', NULL, '{}'),
	('67ab7300-1a14-4456-8c4b-a9f55a1f3fad', 'ejual-media', 'media/1.jpg', NULL, '2026-06-30 15:34:24.133078+00', '2026-06-30 15:34:24.133078+00', '2026-06-30 15:34:24.133078+00', '{"eTag": "\"b54549da0e6a18999bbe96c9ea62dd26\"", "size": 26496, "mimetype": "image/jpeg", "cacheControl": "no-cache", "lastModified": "2026-06-30T15:34:25.000Z", "contentLength": 26496, "httpStatusCode": 200}', '0fd71f1d-399c-4882-b0fe-86b0156a7abb', NULL, '{}'),
	('5a1a597c-9292-46de-a68a-e2239a568b6f', 'ejual-media', 'media/nike-ja-3-turquoise-red-3.webp', NULL, '2026-06-30 15:34:39.61844+00', '2026-06-30 15:34:39.61844+00', '2026-06-30 15:34:39.61844+00', '{"eTag": "\"6a42919e157246946b61eea5fb4ecb83\"", "size": 120762, "mimetype": "image/webp", "cacheControl": "no-cache", "lastModified": "2026-06-30T15:34:40.000Z", "contentLength": 120762, "httpStatusCode": 200}', '76a939c6-bfad-49af-9fa9-2d2295371ac7', NULL, '{}'),
	('a2eafaa2-ebe7-4b52-9cf6-27d1f6db592f', 'ejual-media', 'media/24.webp', NULL, '2026-06-30 15:34:40.019525+00', '2026-06-30 15:34:40.019525+00', '2026-06-30 15:34:40.019525+00', '{"eTag": "\"84166f279afb7dfabbdb6f346801cbca\"", "size": 38904, "mimetype": "image/webp", "cacheControl": "no-cache", "lastModified": "2026-06-30T15:34:41.000Z", "contentLength": 38904, "httpStatusCode": 200}', '7630a782-0330-484c-9243-7c817688e91e', NULL, '{}'),
	('462e7168-e8d8-4e09-a71f-55f20a1d09ae', 'ejual-media', 'media/saint_laurent_cat-eye_irregular_sunglasses_black_f_0_32778.avif', NULL, '2026-06-30 15:38:23.572915+00', '2026-06-30 15:38:23.572915+00', '2026-06-30 15:38:23.572915+00', '{"eTag": "\"9f092abcb95a356e0af2de8ded84500f\"", "size": 879, "mimetype": "image/avif", "cacheControl": "no-cache", "lastModified": "2026-06-30T15:38:24.000Z", "contentLength": 879, "httpStatusCode": 200}', 'c6344b2f-0042-428e-8092-1a8fd49d0113', NULL, '{}'),
	('1a9caec5-8eeb-4d16-98a9-a21ae1b18c88', 'ejual-media', 'media/saint_laurent_cat-eye_irregular_sunglasses_black_f_3_32779.avif', NULL, '2026-06-30 15:38:24.049276+00', '2026-06-30 15:38:24.049276+00', '2026-06-30 15:38:24.049276+00', '{"eTag": "\"8586bed6334620cf6213a04e2dbb73a6\"", "size": 852, "mimetype": "image/avif", "cacheControl": "no-cache", "lastModified": "2026-06-30T15:38:25.000Z", "contentLength": 852, "httpStatusCode": 200}', 'bf655cf1-8f6e-47d8-8a6f-68c4dc52a597', NULL, '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: _pages_v_blocks_archive_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_pages_v_blocks_archive_id_seq"', 1, false);


--
-- Name: _pages_v_blocks_content_columns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_pages_v_blocks_content_columns_id_seq"', 1, false);


--
-- Name: _pages_v_blocks_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_pages_v_blocks_content_id_seq"', 1, false);


--
-- Name: _pages_v_blocks_cta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_pages_v_blocks_cta_id_seq"', 1, false);


--
-- Name: _pages_v_blocks_cta_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_pages_v_blocks_cta_links_id_seq"', 1, false);


--
-- Name: _pages_v_blocks_form_block_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_pages_v_blocks_form_block_id_seq"', 1, false);


--
-- Name: _pages_v_blocks_media_block_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_pages_v_blocks_media_block_id_seq"', 1, false);


--
-- Name: _pages_v_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_pages_v_id_seq"', 1, false);


--
-- Name: _pages_v_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_pages_v_rels_id_seq"', 1, false);


--
-- Name: _pages_v_version_hero_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_pages_v_version_hero_links_id_seq"', 1, false);


--
-- Name: _posts_v_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_posts_v_id_seq"', 1, false);


--
-- Name: _posts_v_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_posts_v_rels_id_seq"', 1, false);


--
-- Name: _posts_v_version_populated_authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_posts_v_version_populated_authors_id_seq"', 1, false);


--
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."addresses_id_seq"', 1, false);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."cart_items_id_seq"', 1, false);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."carts_id_seq"', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."categories_id_seq"', 7, true);


--
-- Name: footer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."footer_id_seq"', 1, false);


--
-- Name: footer_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."footer_rels_id_seq"', 1, false);


--
-- Name: form_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."form_submissions_id_seq"', 1, false);


--
-- Name: forms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."forms_id_seq"', 1, false);


--
-- Name: header_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."header_id_seq"', 1, false);


--
-- Name: header_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."header_rels_id_seq"', 1, false);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."inventory_id_seq"', 14, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."media_id_seq"', 9, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."notifications_id_seq"', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."order_items_id_seq"', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."orders_id_seq"', 1, false);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pages_id_seq"', 1, false);


--
-- Name: pages_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pages_rels_id_seq"', 1, false);


--
-- Name: payload_folders_folder_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."payload_folders_folder_type_id_seq"', 1, false);


--
-- Name: payload_folders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."payload_folders_id_seq"', 1, false);


--
-- Name: payload_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."payload_jobs_id_seq"', 1, false);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."payload_kv_id_seq"', 1, false);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."payload_locked_documents_id_seq"', 1, true);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."payload_locked_documents_rels_id_seq"', 2, true);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."payload_migrations_id_seq"', 1, true);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."payload_preferences_id_seq"', 3, true);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."payload_preferences_rels_id_seq"', 6, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."posts_id_seq"', 1, false);


--
-- Name: posts_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."posts_rels_id_seq"', 1, false);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."product_images_id_seq"', 7, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."product_variants_id_seq"', 14, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."products_id_seq"', 7, true);


--
-- Name: redirects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."redirects_id_seq"', 1, false);


--
-- Name: redirects_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."redirects_rels_id_seq"', 1, false);


--
-- Name: search_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."search_id_seq"', 1, false);


--
-- Name: search_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."search_rels_id_seq"', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_id_seq"', 12, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict KgMvhw5PgXitAmL9gSUjpOiaM0oAckgIZ1TZQScHuYZbRfVVYRYAtGccZADc56d

RESET ALL;
