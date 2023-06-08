SET IDENTITY_INSERT [dbo].[RoleTables] ON
INSERT INTO [dbo].[RoleTables] ([Id], [Role_Name]) VALUES (1, N'SuperAdmin')
INSERT INTO [dbo].[RoleTables] ([Id], [Role_Name]) VALUES (2, N'Manager')
SET IDENTITY_INSERT [dbo].[RoleTables] OFF

SET IDENTITY_INSERT RoleTables ON;

INSERT INTO RoleTables (Id,Role_Name)
VALUES (3, 'Team Leader'), (4, 'Employee'), (5,'Admin');

SET IDENTITY_INSERT RoleTables OFF;
