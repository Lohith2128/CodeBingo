module {
  /// A saved code snippet for a specific language, owned by a user.
  public type CodeSnippet = {
    language : Text;
    code : Text;
    savedAt : Int;
  };

  /// Summary of a saved language (for listing without returning full code).
  public type LanguageSummary = {
    language : Text;
    savedAt : Int;
  };
};
